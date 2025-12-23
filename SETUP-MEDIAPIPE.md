# AI-Safe Virtual Lab - Setup Guide

## 📋 Panduan Setup Integrasi MediaPipe

### 1️⃣ Install Dependencies Backend (Python)

```bash
cd api
pip install -r requirements.txt
```

Dependencies yang dibutuhkan:
- Flask 3.0.0
- Flask-CORS 4.0.0
- OpenCV 4.10.0.84
- MediaPipe 0.10.20
- NumPy 1.24.3

### 2️⃣ Jalankan Flask Backend Server

```bash
cd api
python server.py
```

Server akan berjalan di: `http://localhost:5000`

Endpoints yang tersedia:
- `GET /video_feed` - Video streaming dengan MediaPipe hand tracking
- `GET /api/mixture` - Status campuran kimia saat ini
- `POST /api/add_chemical` - Tambah bahan kimia ke campuran
- `POST /api/reset` - Reset campuran kimia
- `GET /api/chemicals` - Database bahan kimia

### 3️⃣ Jalankan Next.js Frontend

Di terminal baru:

```bash
npm run dev
```

Buka browser: `http://localhost:3000/dashboard`

## 🎮 Cara Menggunakan

### Gesture Controls (MediaPipe Hand Tracking):
1. **Pinch Gesture** (Jempol + Telunjuk) - Deteksi gesture untuk interaksi
2. **Index Finger** - Posisi cursor virtual
3. Real-time hand skeleton tracking dengan visualisasi hijau

### Chemical Mixing:
1. Klik bahan kimia di sidebar kiri untuk menambahkan ke campuran
2. Sistem akan otomatis menghitung pH hasil campuran
3. Lihat status campuran di overlay bawah video feed
4. Klik tombol "Reset Mixture" untuk membersihkan campuran

### Bahan Kimia yang Tersedia:
- **HCl** - Asam Klorida (pH 1.0) - Asam kuat
- **NaOH** - Natrium Hidroksida (pH 13.0) - Basa kuat  
- **CH3COOH** - Asam Asetat (pH 4.5) - Asam lemah
- **H2SO4** - Asam Sulfat (pH 1.5) - Asam kuat korosif
- **H2O** - Air (pH 7.0) - Netral
- **NH3** - Amonia (pH 11.0) - Basa lemah
- **PP** - Fenolftalein (pH 7.0) - Indikator
- **NaCl** - Garam Dapur (pH 7.0) - Garam netral

## 🔧 Troubleshooting

### Kamera tidak terdeteksi:
```python
# Edit api/server.py, line 266
camera = cv2.VideoCapture(0)  # Ubah 0 ke 1 atau 2
```

### CORS Error:
Pastikan Flask-CORS sudah terinstall dan server berjalan di port 5000

### Server Offline di Dashboard:
1. Cek apakah Flask server sudah running
2. Pastikan tidak ada firewall yang memblokir port 5000
3. Cek terminal Flask untuk error messages

## 📂 Struktur File Baru

```
AI-Safe/
├── api/
│   ├── server.py          # Flask backend dengan MediaPipe
│   └── requirements.txt   # Dependencies Python
├── app/
│   └── dashboard/
│       └── page.tsx       # Dashboard dengan video streaming
└── UAS-PROJEK/
    └── ChemAqua-Lab.py    # Original Python code (referensi)
```

## 🎯 Fitur yang Sudah Diimplementasikan

✅ Real-time webcam streaming dengan MediaPipe hand tracking
✅ Deteksi gesture pinch (jempol + telunjuk)
✅ Visualisasi hand skeleton dengan efek glowing
✅ Sistem pencampuran bahan kimia real-time
✅ Perhitungan pH otomatis berdasarkan komponen
✅ REST API untuk komunikasi frontend-backend
✅ Live connection status indicator
✅ Chemical inventory dengan search functionality
✅ Interactive AR overlay pada video feed

## 🚀 Next Steps (Optional)

- [ ] Implementasi gesture untuk memilih chemical
- [ ] Virtual beaker dengan particle effects
- [ ] YOLOv5 object detection untuk deteksi peralatan
- [ ] Face detection untuk PPE safety check
- [ ] Export data hasil eksperimen
- [ ] Multi-user support dengan WebSocket
