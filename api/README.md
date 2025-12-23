# SOLVIA Backend API

Backend FastAPI untuk aplikasi SOLVIA (Solution Vision-driven Integrated Analytics)

## Features

### 🎥 **WebSocket Video Streaming**
- Real-time video streaming dengan MediaPipe Hands detection
- Support untuk YOLOv5 fall detection (opsional)
- Frame encoding dalam Base64 untuk efisiensi transfer

### ⚗️ **Advanced Chemistry Engine**
- Perhitungan pH berdasarkan Molaritas (M) dan Volume (V)
- Support untuk asam kuat, asam lemah, basa kuat, basa lemah
- Perhitungan reaksi netralisasi asam-basa
- Support untuk indikator kimia (Fenolftalein, Metil Orange)
- Perhitungan warna campuran secara real-time

### 📊 **State Management**
- Tracking komposisi wadah kimia
- History log reaksi kimia
- Real-time pH monitoring
- Safety status tracking

## Installation

### 1. Install Dependencies

```bash
cd api
pip install -r requirements.txt
```

### 2. Run Server

```bash
# Development mode with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production mode
python main.py
```

Server akan berjalan di: `http://localhost:8000`

## API Endpoints

### REST API

#### `GET /`
Health check endpoint
```json
{
  "message": "SOLVIA Backend API",
  "version": "1.0.0",
  "status": "running"
}
```

#### `GET /api/chemicals`
Mendapatkan daftar semua bahan kimia yang tersedia
```json
{
  "chemicals": {
    "HCl": {
      "name": "Asam Klorida (HCl)",
      "type": "strong_acid",
      "pH": 1.0,
      "color": [0, 0, 200],
      "description": "Asam kuat, Ka sangat besar",
      "molarity": 1.0
    },
    ...
  }
}
```

#### `POST /api/mixture/add`
Menambahkan bahan kimia ke campuran
```json
{
  "chemical_id": "HCl",
  "volume": 10.0,
  "molarity": 1.0
}
```

Response:
```json
{
  "success": true,
  "mixture_state": {
    "components": [...],
    "total_volume": 10.0,
    "current_pH": 1.0,
    "current_color": [0, 0, 200],
    "reaction_name": "Asam Klorida (HCl)",
    "description": "Asam kuat, Ka sangat besar (pH 1.00)",
    "timestamp": "2025-12-23T10:30:00"
  },
  "reaction_log": [...]
}
```

#### `GET /api/mixture/state`
Mendapatkan status campuran saat ini

#### `POST /api/mixture/reset`
Reset campuran ke kondisi kosong

#### `GET /api/safety/status`
Mendapatkan status keamanan sistem

### WebSocket API

#### `WS /ws/camera`
WebSocket endpoint untuk streaming video dengan MediaPipe

**Connect:**
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/camera');
```

**Receive Data:**
```json
{
  "frame": "base64_encoded_image",
  "hand_data": {
    "hands_detected": true,
    "landmarks": [...],
    "gesture": "pinch"
  },
  "mixture_state": {
    "current_pH": 7.0,
    "reaction_name": "...",
    ...
  },
  "safety_status": "safe",
  "timestamp": "2025-12-23T10:30:00"
}
```

## Chemistry Calculations

### pH Calculation for Strong Acids/Bases

**Strong Acid (HCl):**
```python
# Completely dissociates: HCl → H⁺ + Cl⁻
[H⁺] = Molarity × Volume (L)
pH = -log₁₀[H⁺]
```

**Strong Base (NaOH):**
```python
# Completely dissociates: NaOH → Na⁺ + OH⁻
[OH⁻] = Molarity × Volume (L)
pOH = -log₁₀[OH⁻]
pH = 14 - pOH
```

### Neutralization Reaction

**HCl + NaOH → NaCl + H₂O**
```python
# Calculate net H⁺ or OH⁻
if H⁺_moles > OH⁻_moles:
    net_H⁺ = H⁺_moles - OH⁻_moles
    pH = -log₁₀(net_H⁺ / total_volume)
elif OH⁻_moles > H⁺_moles:
    net_OH⁻ = OH⁻_moles - H⁺_moles
    pOH = -log₁₀(net_OH⁻ / total_volume)
    pH = 14 - pOH
else:
    pH = 7.0  # Perfect neutralization
```

### Weak Acids/Bases

**Weak Acid (CH₃COOH):**
```python
# Ka = 1.8 × 10⁻⁵
[H⁺] ≈ √(Ka × M)
pH = -log₁₀[H⁺]
```

**Weak Base (NH₃):**
```python
# Kb = 1.8 × 10⁻⁵
[OH⁻] ≈ √(Kb × M)
pOH = -log₁₀[OH⁻]
pH = 14 - pOH
```

## Database Bahan Kimia

| ID | Nama | Tipe | pH Default | Molarity |
|----|------|------|------------|----------|
| HCl | Asam Klorida | strong_acid | 1.0 | 1.0 M |
| H2SO4 | Asam Sulfat | strong_acid | 1.0 | 1.0 M |
| HNO3 | Asam Nitrat | strong_acid | 1.0 | 1.0 M |
| CH3COOH | Asam Asetat | weak_acid | 4.5 | 1.0 M |
| H2O | Air | neutral | 7.0 | 55.5 M |
| NaOH | Natrium Hidroksida | strong_base | 14.0 | 1.0 M |
| KOH | Kalium Hidroksida | strong_base | 14.0 | 1.0 M |
| NH3 | Amonia | weak_base | 11.0 | 1.0 M |
| NaCl | Garam Dapur | salt_neutral | 7.0 | 1.0 M |
| PP | Fenolftalein | indicator | 7.0 | 0.1 M |
| MO | Metil Orange | indicator | 7.0 | 0.1 M |

## Integration dengan Frontend

### Next.js WebSocket Client Example

```typescript
// In your Next.js component
const [frame, setFrame] = useState<string>('');
const [mixtureState, setMixtureState] = useState<any>(null);

useEffect(() => {
  const ws = new WebSocket('ws://localhost:8000/ws/camera');
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setFrame(data.frame);
    setMixtureState(data.mixture_state);
  };
  
  return () => ws.close();
}, []);

// Display frame
<img src={`data:image/jpeg;base64,${frame}`} alt="Camera Feed" />
```

### REST API Client Example

```typescript
// Add chemical to mixture
const addChemical = async (chemicalId: string, volume: number, molarity: number) => {
  const response = await fetch('http://localhost:8000/api/mixture/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chemical_id: chemicalId, volume, molarity })
  });
  
  const data = await response.json();
  return data;
};
```

## Testing

### Test WebSocket Connection

```bash
# Install wscat
npm install -g wscat

# Connect to WebSocket
wscat -c ws://localhost:8000/ws/camera
```

### Test REST API

```bash
# Get chemicals list
curl http://localhost:8000/api/chemicals

# Add chemical
curl -X POST http://localhost:8000/api/mixture/add \
  -H "Content-Type: application/json" \
  -d '{"chemical_id": "HCl", "volume": 10, "molarity": 1.0}'

# Get mixture state
curl http://localhost:8000/api/mixture/state

# Reset mixture
curl -X POST http://localhost:8000/api/mixture/reset
```

## API Documentation

Setelah server berjalan, buka:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Troubleshooting

### Camera tidak terbuka
```python
# Coba ganti index camera
cap = cv2.VideoCapture(1)  # Atau 2, 3, dst
```

### WebSocket disconnect
- Pastikan frontend menggunakan port yang benar
- Check CORS settings di `allow_origins`

### Import error MediaPipe
```bash
pip uninstall mediapipe
pip install mediapipe==0.10.20
```

## Future Enhancements

- [ ] YOLOv5 integration untuk fall detection
- [ ] Multiple camera support
- [ ] Recording dan playback
- [ ] Export hasil eksperimen ke PDF
- [ ] Database persistence dengan SQLite/PostgreSQL
- [ ] User authentication dan session management

## License

MIT License - SOLVIA Project 2025
