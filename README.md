# 🧪 SOLVIA - Solution Vision-driven Integrated Analytics

**Modern Science Dashboard** untuk Virtual Chemistry Lab dengan AI Safety Monitoring

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue)](https://python.org/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Latest-orange)](https://mediapipe.dev/)

---

## 🎯 Overview

SOLVIA adalah platform virtual chemistry lab berbasis web yang mengintegrasikan:
- 🎥 **Real-time Video Streaming** dengan MediaPipe Hands detection
- ⚗️ **Advanced Chemistry Engine** dengan perhitungan pH berbasis Molaritas
- 🤖 **AI Safety Monitoring** untuk deteksi posisi berbahaya
- 📊 **Real-time Analytics Dashboard** dengan visualisasi modern

---

## ✨ Features

### 🎨 Frontend (Next.js + React)
- ✅ Modern Science Dashboard dengan tema Midnight Blue + Cyan
- ✅ Live Camera Feed dengan MediaPipe overlay (70% layout)
- ✅ Analytical Sidebar dengan pH Meter, Reaction Log, Safety Alert (30% layout)
- ✅ Real-time AI Safety Monitor (Green/Red indicator)
- ✅ Futuristic UI dengan glass-morphism effects
- ✅ Control buttons: Reset Lab & Take Screenshot

### 🔧 Backend (FastAPI + Python)
- ✅ WebSocket streaming untuk video real-time
- ✅ MediaPipe Hands integration
- ✅ Chemistry Engine dengan 11 bahan kimia
- ✅ pH calculation: Strong/Weak acids & bases
- ✅ Neutralization reaction calculations
- ✅ Chemical indicators (Fenolftalein, Metil Orange)
- ✅ State management untuk mixture tracking
- ✅ RESTful API endpoints

---

## 🚀 Quick Start

### Option 1: Automatic (Recommended)

```powershell
# Start both backend and frontend
.\start-solvia.ps1
```

### Option 2: Manual

**Terminal 1 - Backend:**
```bash
cd api
python main.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## 📦 Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- Webcam (optional, for video streaming)

### Setup

```bash
# 1. Install frontend dependencies
npm install

# 2. Install backend dependencies
cd api
pip install -r requirements.txt
```

---

## 🌐 URLs

| Service | URL | Description |
|---------|-----|-------------|
| 🌐 Frontend | http://localhost:3000 | SOLVIA Dashboard |
| 🔧 Backend API | http://localhost:8000 | FastAPI Server |
| 📚 API Docs | http://localhost:8000/docs | Swagger UI |
| 🔌 WebSocket | ws://localhost:8000/ws/camera | Video Stream |

---

## 🧪 Chemistry Engine

### Supported Chemicals (11 Total)

**Strong Acids:** HCl, H₂SO₄, HNO₃  
**Weak Acids:** CH₃COOH (Ka=1.8×10⁻⁵)  
**Neutral:** H₂O  
**Strong Bases:** NaOH, KOH  
**Weak Bases:** NH₃ (Kb=1.8×10⁻⁵)  
**Salts:** NaCl  
**Indicators:** Fenolftalein (PP), Metil Orange (MO)

### pH Calculation Examples

```python
# Example 1: Strong Acid
10mL of 1M HCl → pH ≈ 1.0

# Example 2: Neutralization
10mL HCl (1M) + 10mL NaOH (1M) → pH ≈ 7.0
Reaction: HCl + NaOH → NaCl + H₂O

# Example 3: Weak Acid
10mL of 0.1M CH₃COOH → pH ≈ 2.87
```

---

## 📁 Project Structure

```
AI-Safe/
├── 📁 api/
│   ├── main.py                     ⭐ FastAPI backend
│   ├── requirements.txt            📦 Python dependencies
│   ├── test_api.py                 🧪 Test suite
│   └── README.md                   📚 Backend documentation
│
├── 📁 app/
│   ├── page.tsx                    ⭐ SOLVIA main dashboard
│   ├── hooks/
│   │   └── useSolviaWebSocket.ts   🎣 WebSocket React hook
│   ├── dashboard/
│   ├── experiments/
│   └── data-analysis/
│
├── 📁 UAS-PROJEK/
│   └── ChemAqua-Lab.py             🔬 Original chemistry code
│
├── start-solvia.ps1                🚀 Quick start (both servers)
├── start-backend.ps1               🔧 Start backend only
├── start-frontend.ps1              🌐 Start frontend only
│
├── SETUP-BACKEND.md                📖 Complete setup guide
├── TECHNICAL-DOCS.md               📝 Technical documentation
├── PROJECT-SUMMARY.md              📋 Project summary
├── QUICK-REFERENCE.md              🎯 Quick reference card
└── README.md                       📚 This file
│   ├── data-analysis/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── Navigation.tsx
├── public/
```

---

## 🎛️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development  
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Modern icon library

### Backend
- **FastAPI** - High-performance Python web framework
- **MediaPipe** - Hand tracking ML
- **OpenCV** - Computer vision
- **Pydantic** - Data validation
- **WebSockets** - Real-time communication

---

## 📚 API Quick Reference

```bash
# Get all chemicals
GET http://localhost:8000/api/chemicals

# Add chemical
POST http://localhost:8000/api/mixture/add
{"chemical_id": "HCl", "volume": 10, "molarity": 1.0}

# Get mixture state
GET http://localhost:8000/api/mixture/state

# Reset mixture
POST http://localhost:8000/api/mixture/reset
```

---

## 🧪 Testing

```bash
# Test backend API
python api/test_api.py

# Test WebSocket
wscat -c ws://localhost:8000/ws/camera
```

---

## 📖 Documentation

- [SETUP-BACKEND.md](SETUP-BACKEND.md) - Complete setup guide
- [TECHNICAL-DOCS.md](TECHNICAL-DOCS.md) - Technical architecture
- [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md) - Project overview
- [QUICK-REFERENCE.md](QUICK-REFERENCE.md) - Quick reference
- [api/README.md](api/README.md) - Backend API docs

---

## 🎨 Custom Tailwind Classes

- `btn-cyber` - Gradient button with hover effects
- `card-cyber` - Dark card with glowing border
- `input-cyber` - Styled input field
- `text-gradient` - Gradient text effect
- `nav-link` - Animated navigation link

## 🌈 Color Palette

**SOLVIA Theme:**
- `midnight-blue`: #0c1e3a
- `cyan`: #00d4ff
- `safe-green`: #22c55e
- `danger-red`: #ef4444

**Legacy Theme:**
- `cyber-dark`: #0a0e27
- `cyber-blue`: #00d4ff
- `cyber-purple`: #a855f7
- `cyber-pink`: #ec4899

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

---

## 🔧 Troubleshooting

**Backend won't start:**
```bash
cd api && pip install -r requirements.txt
```

**Camera not opening:**
Edit `api/main.py` line ~540: `cv2.VideoCapture(1)`

**Port in use:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

---

## 🤝 Contributing

Contributions welcome! Fork → Branch → Commit → Push → PR

---

## 📄 License

MIT License - Educational purposes

---

## 👥 Credits

**Original**: ChemAqua-Lab.py (MediaPipe + Chemistry)  
**Enhanced**: SOLVIA (FastAPI Backend + Modern UI)  
**Created**: December 23, 2025

---

**🧪 SOLVIA - Making Chemistry Safe & Accessible**

Built with ❤️ using Next.js, FastAPI, MediaPipe, and Chemistry
