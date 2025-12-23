# 🔍 PANDUAN MENCARI MODEL TERBAIK

## 📂 **Lokasi Model yang Terdeteksi dari Notebook:**

Berdasarkan analisis notebook `Sigmoid_(5) (5).ipynb`:

### 1️⃣ **exp** (Cell 11 - Evaluasi)
```
Path: /content/gdrive/MyDrive/yolov5/runs/train/exp/weights/best.pt
```
**Status**: ❌ **BURUK** - F1 = 0.56 (dari F1-curve yang ditunjukkan)
- `non_fall` F1 ≈ 0.0 (tidak terdeteksi)
- `fall` F1 ≈ 0.77
- Model over-predict ke class "fall"

### 2️⃣ **exp2** (Cell 16 - Detection)
```
Path: /content/yolov5/runs/train/exp2/weights/best.pt
```
**Status**: ❓ **BELUM DIEVALUASI** - Kemungkinan LEBIH BAGUS
- Anda pakai model ini untuk detection
- Artinya Anda pernah cek dan merasa ini lebih baik
- **REKOMENDASI: CEK MODEL INI DULU!**

### 3️⃣ **exp3** (Cell 19 - Submission)
```
Path: /content/gdrive/MyDrive/yolov5/runs/detect/exp3/labels
```
**Status**: Ini bukan training experiment, tapi hasil detection

---

## 🎯 **Cara Cepat Cek Model Terbaik:**

Saya sudah buatkan **3 cell baru** di notebook Anda:

### **Cell 12**: Cek Semua Model yang Tersimpan
- List semua experiment (exp, exp2, exp3, dst)
- Tampilkan size dan metrics dari results.txt

### **Cell 14**: Evaluasi Lengkap exp2
- Running full validation
- Confusion matrix
- F1-Confidence curve
- Metrics detail

### **Cell 16**: Comparison Tool
- Compare semua experiment
- Ranking berdasarkan mAP@0.5
- Visual chart comparison
- **Auto-detect model terbaik!**

---

## 📊 **Metrics Target untuk Model Bagus:**

```
Metric               Minimum   Good    Excellent
───────────────────────────────────────────────
Precision            0.70      0.85    >0.90
Recall               0.70      0.85    >0.90
F1-Score             0.70      0.85    >0.90
mAP@0.5              0.70      0.85    >0.90
mAP@0.5:0.95         0.50      0.70    >0.80
```

**⚠️ PENTING**: F1 untuk **KEDUA CLASS** (fall & non_fall) harus >0.70!

---

## 🚀 **Step-by-Step Action Plan:**

### Step 1: Jalankan Cell 12 (List Models)
```python
# Output akan seperti:
📁 Daftar Model yang Tersimpan:

📦 exp/
   ✅ best.pt (14.3 MB)
   📊 mAP@0.5: 0.567

📦 exp2/
   ✅ best.pt (14.3 MB)
   📊 mAP@0.5: 0.???  ← CEK INI!
```

### Step 2: Jalankan Cell 14 (Evaluasi exp2)
Output akan menunjukkan:
- Precision & Recall per class
- Confusion matrix
- F1-Confidence curve
- **Class-specific metrics** (fall vs non_fall)

### Step 3: Jalankan Cell 16 (Compare All)
Tool ini akan:
- Ranking semua model
- Show best model automatically
- Visual comparison charts

### Step 4: Pilih Model Terbaik
Kriteria:
- ✅ mAP@0.5 > 0.85 (Excellent) or > 0.70 (Good)
- ✅ F1 (non_fall) > 0.70
- ✅ F1 (fall) > 0.70
- ✅ Balanced precision & recall

---

## 💾 **Download Model ke Local (Windows):**

Setelah tahu model terbaik (misal: exp2):

### Via Google Drive Web:
1. Buka Google Drive di browser
2. Navigate: `MyDrive/yolov5/runs/train/exp2/weights/`
3. Klik kanan `best.pt` → Download
4. Copy ke: `C:\INFORMATIKA\SEMESTER 5\Viskom\AI-Safe\api\models\best.pt`

### Via Colab (Generate Download Link):
```python
# Di Colab, jalankan:
from google.colab import files

# Download model terbaik (ganti exp2 dengan yang terbaik)
model_path = "/content/gdrive/MyDrive/yolov5/runs/train/exp2/weights/best.pt"
files.download(model_path)
```

### Via gdown (Direct Download):
```python
# Colab: Generate shareable link
from google.colab import drive
import os

model_path = "/content/gdrive/MyDrive/yolov5/runs/train/exp2/weights/best.pt"

# Get file ID
!echo "Share this file in Google Drive, then use:"
!echo "gdown --id FILE_ID -O api/models/best.pt"
```

---

## 🔧 **Cara Menggunakan Model Custom di SOLVIA:**

Setelah download model terbaik:

```bash
# 1. Copy ke folder models
copy "Downloads\best.pt" "C:\INFORMATIKA\SEMESTER 5\Viskom\AI-Safe\api\models\best.pt"

# 2. Verify
dir api\models\best.pt

# 3. Start backend (akan auto-load custom model)
cd api
python main.py
```

Expected output:
```
🔄 Loading custom fall detection model from models/best.pt...
✅ Custom YOLOv5 fall detection model loaded successfully!
📊 Model trained with fall/non-fall dataset
🚀 SOLVIA Backend Server Started
🤖 YOLOv5 Fall Detection: ENABLED (Custom Model)
```

---

## 📈 **Verifikasi Model di SOLVIA:**

Test dengan webcam:
1. Start backend: `python api/main.py`
2. Start frontend: `npm run dev`
3. Open: http://localhost:3000
4. Test scenarios:
   - Standing → Should show GREEN box + "SAFE"
   - Lying down → Should show RED box + "ALERT"
   - Check console for detection confidence

---

## ❓ **Troubleshooting:**

### "Tidak ada experiment lain selain exp"
Berarti hanya ada 1 training run. Options:
- ✅ Gunakan YOLOv5n default + aspect ratio (lebih reliable)
- ❌ JANGAN gunakan exp/best.pt (F1=0.56 buruk)
- 🔄 OR: Re-train dengan perbaikan dataset

### "exp2 juga buruk (F1 < 0.70)"
Stick dengan implementasi default:
```python
# api/main.py - Current implementation is better
yolo_model = torch.hub.load('ultralytics/yolov5', 'yolov5n')
yolo_model.classes = [0]  # Person detection
is_fallen = aspect_ratio > 1.3  # Heuristic
```

### "Semua model mAP@0.5 < 0.70"
Root cause: Dataset annotation issue
- Bounding box full image (1.0 x 1.0)
- Tidak ada proper object detection annotation
- Need to re-annotate dataset dengan tool seperti LabelImg

---

## 🎯 **Recommendation:**

**PRIORITAS ACTIONS:**
1. ✅ Jalankan cell 12, 14, 16 di notebook untuk find best model
2. ✅ Cek apakah exp2 atau exp lain punya mAP > 0.85
3. ✅ Download model terbaik
4. ✅ Test di SOLVIA

**JIKA SEMUA MODEL BURUK:**
- Stick dengan YOLOv5n default (sudah implemented)
- Aspect ratio detection proven & reliable
- No need custom model dengan performa buruk

---

📞 **Support**: Lihat `MODEL-ANALYSIS.md` untuk analisis lengkap masalah F1-curve rendah.
