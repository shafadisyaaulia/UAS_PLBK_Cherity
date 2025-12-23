# 🚨 ANALISIS MODEL - F1-Confidence Curve

## ❌ **MASALAH UTAMA: Model Exp1 Tidak Bagus**

### 📊 Hasil dari F1-Confidence Curve:

```
Class         F1-Score   Status
───────────────────────────────
non_fall      ~0.00      ❌ SANGAT BURUK
fall          ~0.77      ⚠️  Lumayan
All classes   0.56       ❌ RENDAH
```

## 🔍 **Root Cause Analysis:**

### 1. **Severe Class Imbalance**
Model sangat bias ke class `fall`:
- Hampir semua prediksi → `fall`
- Class `non_fall` tidak terdeteksi sama sekali
- Precision/Recall tidak seimbang

### 2. **Dataset Issues (Kemungkinan)**
```python
# Dari notebook cell 5:
label = 1 if category == "fall" else 0
# Label bounding box: "label 0.5 0.5 1.0 1.0"
```

**Problem**: Bounding box covers full image (1.0 x 1.0)
- Tidak ada anotasi object detection yang proper
- Model belajar dari full image classification, bukan object detection
- Seharusnya ada bounding box spesifik untuk person

### 3. **Training Strategy Issues**
```python
# Dari notebook cell 8:
!python train.py --img 640 --batch 16 --epochs 25 --data ... --weights yolov5s.pt
```

Possible issues:
- Epochs terlalu sedikit? (25)
- Learning rate default?
- No augmentation tuning?
- Class weights tidak di-set

## 💡 **SOLUSI:**

### Option 1: Cek Model Lain (exp2, exp3)
Dari notebook Anda, ada indikasi training lain:
```python
# Cell 12 menggunakan exp2:
!python detect.py --weights /content/yolov5/runs/train/exp2/weights/best.pt
```

**Action**: Jalankan cell baru di notebook untuk evaluasi semua model

### Option 2: Re-train dengan Perbaikan

#### A. Fix Dataset Annotation
Dataset seharusnya:
```
# Current (WRONG):
label x_center y_center width height
1     0.5      0.5      1.0   1.0

# Should be (proper person bbox):
label x_center y_center width height
1     0.5      0.6      0.3   0.8  # Example: person in center
```

#### B. Handle Class Imbalance
```python
# Tambahkan ke training command:
!python train.py \
  --img 640 \
  --batch 16 \
  --epochs 50 \  # Lebih banyak epochs
  --data data_slayer.yaml \
  --weights yolov5s.pt \
  --hyp hyp.scratch-low.yaml \  # Custom hyperparameters
  --cache \
  --patience 10
```

#### C. Custom Hyperparameters untuk Imbalanced Data
Buat file `hyp.fall-detection.yaml`:
```yaml
lr0: 0.01
lrf: 0.1
momentum: 0.937
weight_decay: 0.0005
warmup_epochs: 3.0
warmup_momentum: 0.8
warmup_bias_lr: 0.1
box: 0.05
cls: 0.5  # Increase untuk fokus pada classification
cls_pw: 1.0
obj: 1.0
obj_pw: 1.0
iou_t: 0.20
anchor_t: 4.0
fl_gamma: 0.0
hsv_h: 0.015
hsv_s: 0.7
hsv_v: 0.4
degrees: 0.0
translate: 0.1
scale: 0.5
shear: 0.0
perspective: 0.0
flipud: 0.5  # Untuk fall detection, flip vertical bisa membantu
fliplr: 0.5
mosaic: 1.0
mixup: 0.0
copy_paste: 0.0
```

### Option 3: Gunakan YOLOv5 Default + Aspect Ratio

Untuk SOLVIA, lebih baik gunakan:
1. **YOLOv5n pretrained** (deteksi person dengan akurasi tinggi)
2. **Aspect ratio logic** (width/height > 1.3 = fallen)

Ini lebih reliable daripada model custom yang under-perform!

## 📈 **Metrics yang Harus Dicapai:**

Untuk model fall detection yang bagus:

```
Metric               Target    Current (exp)
────────────────────────────────────────────
Precision (fall)     >0.85     ~0.77
Recall (fall)        >0.90     ???
F1 (fall)           >0.87     ~0.77
F1 (non_fall)       >0.80     ~0.00  ❌
mAP@0.5             >0.90     ???
mAP@0.5:0.95        >0.70     ???
```

## 🎯 **Rekomendasi untuk SOLVIA:**

### Pendekatan 1: Gunakan YOLOv5 Pretrained + Heuristic ✅ (RECOMMENDED)
```python
# api/main.py - Current implementation
yolo_model = torch.hub.load('ultralytics/yolov5', 'yolov5n')
yolo_model.classes = [0]  # Person only

# Fall detection via aspect ratio
aspect_ratio = width / height
is_fallen = aspect_ratio > 1.3
```

**Keuntungan:**
- ✅ Reliable (YOLOv5 pretrained sangat akurat untuk person detection)
- ✅ Fast inference
- ✅ No custom training needed
- ✅ Proven method

### Pendekatan 2: Gunakan Custom Model (Jika Sudah Bagus)
```python
# Only if you have a model with:
# - F1 (non_fall) > 0.80
# - F1 (fall) > 0.85
# - mAP@0.5 > 0.90

yolo_model = torch.hub.load('ultralytics/yolov5', 'custom', path='models/best.pt')
is_fallen = (int(cls) == 1)  # Direct classification
```

## 📋 **Checklist:**

### Immediate Actions:
- [ ] Jalankan cell baru di notebook untuk cek semua model (exp, exp2, exp3)
- [ ] Compare metrics semua model
- [ ] Download model terbaik (highest mAP & balanced F1)

### If All Models Poor:
- [ ] Stick dengan YOLOv5n + aspect ratio (sudah implemented)
- [ ] OR: Re-train dengan proper bounding box annotation
- [ ] OR: Cari pre-trained fall detection model dari komunitas

### For Production:
- [ ] Test model dengan real webcam footage
- [ ] Measure false positive rate
- [ ] Adjust confidence threshold untuk balance precision/recall

## 🔗 **Resources:**

- YOLOv5 Class Weights: https://github.com/ultralytics/yolov5/issues/1239
- Imbalanced Data: https://github.com/ultralytics/yolov5/issues/1766
- Custom Hyperparameters: https://github.com/ultralytics/yolov5/wiki/Hyperparameter-Evolution

---

**⚠️ KESIMPULAN: Jangan gunakan model exp/best.pt yang sekarang. F1=0.56 terlalu rendah untuk production!**
