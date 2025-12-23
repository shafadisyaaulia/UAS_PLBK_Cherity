# 🎯 SOLVIA - Custom Fall Detection Model

## 📍 Model Location

Model YOLOv5 custom Anda yang sudah di-train dengan dataset fall/non-fall tersimpan di:

```
Google Drive: MyDrive/yolov5/runs/train/exp/weights/best.pt
```

## 📊 Model Performance

Berdasarkan training Anda:
- **Dataset**: Fall vs Non-Fall
- **Classes**: 
  - Class 0: `non_fall`
  - Class 1: `fall`
- **Architecture**: YOLOv5s
- **Training**: 25 epochs
- **Image Size**: 640x640
- **Batch Size**: 16

## 🚀 Cara Menggunakan Model Custom

### Opsi 1: Download dari Google Drive

1. **Download model dari Google Drive:**
   - Buka Google Drive
   - Navigate ke: `MyDrive/yolov5/runs/train/exp/weights/`
   - Download file: `best.pt`

2. **Copy ke folder ini:**
   ```bash
   # Windows
   copy "path/to/downloaded/best.pt" "C:\INFORMATIKA\SEMESTER 5\Viskom\AI-Safe\api\models\best.pt"
   ```

3. **Restart backend:**
   ```bash
   cd api
   python main.py
   ```

### Opsi 2: Direct Link dari Google Drive

Jika model ada di Google Drive, Anda bisa download langsung:

```python
# Install gdown jika belum ada
pip install gdown

# Download model (ganti FILE_ID dengan ID file Anda)
gdown --id FILE_ID -O models/best.pt
```

**Cara mendapatkan FILE_ID:**
1. Klik kanan pada file `best.pt` di Google Drive
2. Pilih "Get link" → "Anyone with the link"
3. Copy link: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
4. Ambil bagian `FILE_ID`

## ⚙️ Konfigurasi Model

Backend sudah dikonfigurasi untuk:
1. **Prioritas Custom Model**: Jika `models/best.pt` ada, akan digunakan
2. **Fallback ke Default**: Jika tidak ada, menggunakan YOLOv5n default

### Detection Method

**Custom Model (Recommended):**
- Menggunakan klasifikasi langsung dari model
- Class 0 = Non-Fall (Safe)
- Class 1 = Fall (Danger)
- Lebih akurat karena sudah di-train dengan dataset spesifik

**Default Model (Fallback):**
- Menggunakan aspect ratio detection
- Ratio > 1.3 = Fallen (horizontal position)
- Ratio < 1.3 = Standing (vertical position)

## 📈 Keunggulan Custom Model

✅ **Akurasi Lebih Tinggi**: Sudah di-train dengan data fall/non-fall real
✅ **Deteksi Langsung**: Tidak perlu heuristic aspect ratio
✅ **Context Aware**: Memahami berbagai posisi jatuh
✅ **Robust**: Lebih tahan terhadap variasi lighting, angle, dll

## 🔍 Verifikasi Model

Setelah model diletakkan di folder ini, jalankan backend dan cek console:

```
🔄 Loading custom fall detection model from models/best.pt...
✅ Custom YOLOv5 fall detection model loaded successfully!
📊 Model trained with fall/non-fall dataset
🚀 SOLVIA Backend Server Started
🤖 YOLOv5 Fall Detection: ENABLED (Custom Model)
```

## 📝 Model Info

Jika ingin melihat informasi model:

```python
import torch

model = torch.hub.load('ultralytics/yolov5', 'custom', path='models/best.pt')
print(model.names)  # Should show: {0: 'non_fall', 1: 'fall'}
print(f"Classes: {model.nc}")  # Should show: 2
```

## 🎯 Testing

Untuk testing model:

```bash
# Test dengan gambar
python detect.py --weights models/best.pt --source path/to/test/image.jpg

# Test dengan webcam
python detect.py --weights models/best.pt --source 0
```

## ⚡ Performance Tips

- Model size: ~14MB (YOLOv5s)
- Inference time: ~20-30ms per frame (CPU)
- Inference time: ~5-10ms per frame (GPU)

## 📞 Support

Jika ada error loading model, pastikan:
1. File `best.pt` ada di folder `models/`
2. PyTorch sudah terinstall
3. File tidak corrupt (size ~14MB)

---

**🎉 Ready to use your custom trained fall detection model!**
