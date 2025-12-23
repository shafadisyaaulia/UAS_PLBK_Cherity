# 🚀 SOLVIA - Setup Guide

## Quick Start

### 1. Backend Setup (FastAPI)

```bash
# Navigate to API directory
cd api

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
python main.py

# Or with uvicorn (with auto-reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend akan berjalan di: **http://localhost:8000**

### 2. Frontend Setup (Next.js)

```bash
# Install Node.js dependencies (from root directory)
npm install

# Start the development server
npm run dev
```

Frontend akan berjalan di: **http://localhost:3000**

---

## Struktur Proyek

```
AI-Safe/
├── api/
│   ├── main.py              # FastAPI backend utama
│   ├── requirements.txt     # Python dependencies
│   ├── test_api.py         # Test script
│   └── README.md           # Backend documentation
├── app/
│   ├── page.tsx            # SOLVIA main dashboard
│   ├── hooks/
│   │   └── useSolviaWebSocket.ts  # WebSocket hook
│   └── ...
├── UAS-PROJEK/
│   └── ChemAqua-Lab.py     # Original chemistry code
└── package.json
```

---

## Fitur Backend

### ⚗️ Chemistry Engine
- **pH Calculation**: Berdasarkan Molaritas dan Volume
- **Strong Acids/Bases**: HCl, H₂SO₄, NaOH, KOH
- **Weak Acids/Bases**: CH₃COOH, NH₃
- **Neutralization**: Automatic calculation
- **Indicators**: Fenolftalein, Metil Orange

### 🎥 Video Streaming
- **MediaPipe Hands**: Real-time hand tracking
- **WebSocket**: Low-latency streaming
- **Base64 Encoding**: Efficient frame transfer

### 📊 State Management
- Real-time mixture tracking
- Reaction history log
- Safety status monitoring

---

## Testing Backend

### Test dengan Python Script

```bash
# Start backend first
python api/main.py

# In another terminal, run test
python api/test_api.py
```

### Test dengan cURL

```bash
# Health check
curl http://localhost:8000/

# Get chemicals
curl http://localhost:8000/api/chemicals

# Add HCl
curl -X POST http://localhost:8000/api/mixture/add \
  -H "Content-Type: application/json" \
  -d '{"chemical_id": "HCl", "volume": 10, "molarity": 1.0}'

# Get mixture state
curl http://localhost:8000/api/mixture/state

# Reset mixture
curl -X POST http://localhost:8000/api/mixture/reset
```

### Test WebSocket

```bash
# Install wscat
npm install -g wscat

# Connect to WebSocket
wscat -c ws://localhost:8000/ws/camera
```

---

## Frontend Integration

### 1. WebSocket Integration

Gunakan custom hook `useSolviaWebSocket`:

```typescript
import { useSolviaWebSocket } from './hooks/useSolviaWebSocket'

function Dashboard() {
  const { 
    isConnected, 
    frame, 
    handData, 
    mixtureState, 
    safetyStatus 
  } = useSolviaWebSocket()

  return (
    <div>
      {isConnected && (
        <>
          {/* Display camera feed */}
          <img 
            src={`data:image/jpeg;base64,${frame}`} 
            alt="Camera Feed" 
          />
          
          {/* Display pH */}
          <div>pH: {mixtureState?.current_pH.toFixed(2)}</div>
          
          {/* Display safety status */}
          <div>Status: {safetyStatus}</div>
        </>
      )}
    </div>
  )
}
```

### 2. REST API Integration

```typescript
import { 
  getChemicals, 
  addChemical, 
  resetMixture 
} from './hooks/useSolviaWebSocket'

// Get all chemicals
const chemicals = await getChemicals()

// Add chemical
const result = await addChemical('HCl', 10, 1.0)

// Reset mixture
await resetMixture()
```

---

## Chemistry Examples

### Example 1: Strong Acid

```python
# Add 10mL of 1M HCl
POST /api/mixture/add
{
  "chemical_id": "HCl",
  "volume": 10.0,
  "molarity": 1.0
}

# Result: pH ≈ 1.0
```

### Example 2: Neutralization

```python
# Step 1: Add 10mL of 1M HCl
# pH ≈ 1.0

# Step 2: Add 10mL of 1M NaOH
POST /api/mixture/add
{
  "chemical_id": "NaOH",
  "volume": 10.0,
  "molarity": 1.0
}

# Result: pH ≈ 7.0 (Perfect neutralization)
# Reaction: HCl + NaOH → NaCl + H₂O
```

### Example 3: Weak Acid

```python
# Add 10mL of 0.1M CH₃COOH
POST /api/mixture/add
{
  "chemical_id": "CH3COOH",
  "volume": 10.0,
  "molarity": 0.1
}

# Result: pH ≈ 2.87
# Using Ka = 1.8 × 10⁻⁵
```

### Example 4: Indicator

```python
# Step 1: Add 10mL of 0.1M NaOH
# pH ≈ 13.0

# Step 2: Add Phenolphthalein
POST /api/mixture/add
{
  "chemical_id": "PP",
  "volume": 1.0,
  "molarity": 0.01
}

# Result: Pink color appears (pH > 8.3)
```

---

## API Documentation

Setelah backend berjalan, buka dokumentasi interaktif:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## Troubleshooting

### ❌ Backend tidak bisa start

**Error: `ModuleNotFoundError: No module named 'fastapi'`**

```bash
pip install -r api/requirements.txt
```

### ❌ Camera tidak terbuka

**Error: `Could not open camera`**

```python
# Edit api/main.py, line ~540
cap = cv2.VideoCapture(1)  # Try different index: 0, 1, 2
```

### ❌ WebSocket disconnect

**Error: Connection closed immediately**

1. Pastikan backend sudah running
2. Check CORS settings di backend
3. Verify WebSocket URL: `ws://localhost:8000/ws/camera`

### ❌ Frontend tidak connect ke backend

**Error: `fetch failed`**

1. Pastikan backend running di port 8000
2. Check CORS configuration:
   ```python
   # In api/main.py
   allow_origins=["http://localhost:3000"]
   ```

### ❌ Import error MediaPipe

```bash
pip uninstall mediapipe
pip install mediapipe==0.10.20
```

---

## Production Deployment

### Backend (FastAPI)

```bash
# Install production server
pip install gunicorn

# Run with Gunicorn
gunicorn api.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend (Next.js)

```bash
# Build production
npm run build

# Start production server
npm start
```

### Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

---

## Next Steps

1. ✅ Setup backend dan frontend
2. ✅ Test API endpoints
3. ✅ Test WebSocket connection
4. 🚧 Integrate dengan frontend UI
5. 🚧 Add YOLOv5 fall detection
6. 🚧 Add screenshot/export functionality

---

## Support

Jika ada masalah:
1. Check backend logs di terminal
2. Check browser console untuk frontend errors
3. Verify ports: backend (8000), frontend (3000)
4. Review API docs: http://localhost:8000/docs

---

**Created by SOLVIA Team - 2025**
