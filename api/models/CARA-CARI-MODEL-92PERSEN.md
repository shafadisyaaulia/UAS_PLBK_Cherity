# 🔍 CARA MENCARI MODEL TERBAIK (Accuracy 92%)

## 🎯 **Situasi Anda:**
- ✅ Sudah train model di Google Colab
- ✅ Dapat accuracy 92% (excellent!)
- ❓ Tidak tahu model tersimpan di mana

---

## 🚀 **SOLUSI CEPAT - 3 Langkah:**

### **Step 1: Buka Notebook di Colab**
1. Upload `Sigmoid_(5) (5).ipynb` ke Google Colab
2. Atau buka langsung di: https://colab.research.google.com/

### **Step 2: Jalankan Cell Pencarian**
Saya sudah buatkan **2 cell baru** di notebook Anda:

**Cell 17**: 🔍 Automatic Model Finder
- Auto-search di semua path Google Drive
- List semua model yang pernah di-train
- **Ranking by accuracy**
- Highlight model dengan accuracy ≥ 90%

**Cell 18**: 📥 Download ke Local
- Download model terbaik
- Auto-copy ke path yang mudah diakses

### **Step 3: Copy ke SOLVIA**
Setelah download:
```bash
# Windows Command Prompt
copy "Downloads\best_model_expX.pt" "C:\INFORMATIKA\SEMESTER 5\Viskom\AI-Safe\api\models\best.pt"

# Verify
dir "C:\INFORMATIKA\SEMESTER 5\Viskom\AI-Safe\api\models\best.pt"
```

---

## 🔍 **CARA MANUAL (Jika Tidak Mau Jalankan Colab):**

### **Opsi A: Via Google Drive Web**

1. **Buka Google Drive** di browser
2. **Navigate** ke folder:
   ```
   MyDrive/yolov5/runs/train/
   ```

3. **Cari semua folder** `exp`, `exp2`, `exp3`, dst

4. **Untuk setiap folder**, cek:
   ```
   exp/
   ├── weights/
   │   ├── best.pt      ← MODEL ADA DI SINI
   │   └── last.pt
   ├── results.csv      ← METRICS ADA DI SINI
   ├── F1_curve.png
   └── confusion_matrix.png
   ```

5. **Download `results.csv`** dari setiap exp folder

6. **Buka di Excel/Spreadsheet**, cari kolom:
   - `metrics/mAP_0.5(B)` → Last row adalah final accuracy
   - **Nilai 0.92 = 92% accuracy**

7. **Download `best.pt`** dari folder dengan mAP tertinggi

---

### **Opsi B: Via Colab Quick Script**

Jika Anda mau cepat, buka **New Colab Notebook** dan run ini:

```python
from google.colab import drive, files
import os
import pandas as pd

# Mount Drive
drive.mount('/content/gdrive')

# Search models
base = "/content/gdrive/MyDrive/yolov5/runs/train"
for exp in os.listdir(base):
    results = os.path.join(base, exp, "results.csv")
    if os.path.exists(results):
        df = pd.read_csv(results)
        map50 = df.iloc[-1]['metrics/mAP_0.5(B)']
        acc = map50 * 100
        print(f"{exp}: {acc:.2f}% accuracy")
        
        if acc >= 90:
            print(f"  ✅ FOUND! Download:")
            model_path = os.path.join(base, exp, "weights/best.pt")
            files.download(model_path)
```

---

## 📋 **Kemungkinan Lokasi Model:**

### **Path 1: Google Drive (Paling Umum)**
```
/content/gdrive/MyDrive/yolov5/runs/train/
├── exp/
│   └── weights/best.pt
├── exp2/
│   └── weights/best.pt
├── exp3/
│   └── weights/best.pt
└── exp4/  ← MUNGKIN YANG INI (92%)
    └── weights/best.pt
```

### **Path 2: Colab Temporary**
```
/content/yolov5/runs/train/
```
⚠️ **WARNING**: Ini akan hilang setelah Colab session berakhir!

### **Path 3: Shared Drive**
```
/content/gdrive/Shared drives/.../yolov5/runs/train/
```

---

## 🎯 **Cara Tahu Model Mana yang 92%:**

### **Dari results.csv:**
```csv
epoch,train/box_loss,...,metrics/mAP_0.5(B),...
0,0.05,...,0.65,...
1,0.04,...,0.78,...
...
24,0.02,...,0.92,...  ← INI! Last epoch = 92%
```

### **Dari nama file (kadang):**
- Jika ada file seperti `best.pt` dengan tanggal tertentu
- Check modified date untuk tahu yang terbaru

### **Dari F1-curve.png:**
- Buka image `F1_curve.png` di folder exp
- Lihat nilai "all classes" di legend
- Jika ≈ 0.92, ini dia!

---

## 💾 **Setelah Ketemu Model:**

### **Verify Model di SOLVIA:**

1. **Copy ke folder models:**
   ```bash
   copy model.pt "api\models\best.pt"
   ```

2. **Start backend:**
   ```bash
   cd api
   python main.py
   ```

3. **Expected output:**
   ```
   🔄 Loading custom fall detection model from models/best.pt...
   ✅ Custom YOLOv5 fall detection model loaded successfully!
   📊 Model trained with fall/non-fall dataset
   🎯 Model Accuracy: ~92%
   ```

4. **Test dengan webcam:**
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

---

## 🔍 **Troubleshooting:**

### **"Tidak ada folder yolov5/runs/train/"**
→ Model mungkin dihapus atau di Drive lain
→ Check: Trash di Google Drive
→ Check: Colab files (klik folder icon di Colab)

### **"Ada banyak exp folder, bingung yang mana"**
→ Jalankan cell 17 di notebook (auto-ranking)
→ Atau download semua results.csv dan compare di Excel

### **"results.csv tidak ada"**
→ Model mungkin dari training yang incomplete
→ Check apakah ada `best.pt` di weights folder
→ Jika ada, itu kemungkinan model terbaik

### **"Download gagal dari Colab"**
→ File terlalu besar (>14MB bisa lambat)
→ Alternative: Download via Google Drive web
→ Atau gunakan Google Drive desktop app (sync otomatis)

---

## 📊 **Expected Model Properties:**

```
File: best.pt
Size: ~14 MB (YOLOv5s) atau ~7MB (YOLOv5n)
Classes: 2 (non_fall, fall)
mAP@0.5: 0.92 (92%)
F1-Score: >0.85 untuk kedua class
```

---

## 🎉 **Setelah Model Ditemukan:**

1. ✅ **Verify accuracy** (harus 92% seperti yang Anda ingat)
2. ✅ **Download** ke local
3. ✅ **Copy** ke `api/models/best.pt`
4. ✅ **Test** di SOLVIA
5. ✅ **Commit** ke GitHub (opsional)

---

## 📞 **Masih Tidak Ketemu?**

**Last Resort Options:**

1. **Re-train** dengan notebook yang sama (25 epochs ≈ 2-3 jam)
2. **Gunakan YOLOv5n default** + aspect ratio (sudah implemented, reliable!)
3. **Download pre-trained** fall detection model dari komunitas

---

**💡 TIP**: Jalankan Cell 17 di notebook - automatic search paling gampang! 🚀
