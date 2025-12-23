# 🧪 SOLVIA - Technical Documentation

**Solution Vision-driven Integrated Analytics**

Modern Science Dashboard untuk Virtual Chemistry Lab dengan AI Safety Monitoring

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Backend Features](#backend-features)
3. [Frontend Features](#frontend-features)
4. [Chemistry Engine](#chemistry-engine)
5. [WebSocket Protocol](#websocket-protocol)
6. [API Reference](#api-reference)
7. [Deployment](#deployment)

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    SOLVIA Frontend                       │
│                  (Next.js + React)                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Dashboard UI (Midnight Blue + Cyan Theme)       │   │
│  │  - Live Camera Feed (70%)                        │   │
│  │  - Analytical Sidebar (30%)                      │   │
│  │    • pH Meter Gauge                              │   │
│  │    • Reaction Log                                │   │
│  │    • Safety Alert Panel                          │   │
│  │    • Control Buttons                             │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ▼ ▲
                   (WebSocket + REST API)
                          ▼ ▲
┌─────────────────────────────────────────────────────────┐
│                    SOLVIA Backend                        │
│                  (FastAPI + Python)                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Video Processing Pipeline                       │   │
│  │  - MediaPipe Hands Detection                     │   │
│  │  - YOLOv5 Fall Detection (optional)              │   │
│  │  - Frame Encoding (Base64)                       │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Chemistry Engine                                │   │
│  │  - pH Calculation (Molarity-based)               │   │
│  │  - Neutralization Reactions                      │   │
│  │  - Color Mixing Algorithm                        │   │
│  │  - Indicator Behavior                            │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  State Management                                │   │
│  │  - Mixture Tracking                              │   │
│  │  - Reaction History                              │   │
│  │  - Safety Monitoring                             │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ▼
                    (OpenCV)
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Camera Hardware                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Backend Features

### Video Processing
- **MediaPipe Hands**: Real-time hand landmark detection (21 points per hand)
- **Gesture Recognition**: Pinch detection for interaction
- **Frame Rate**: 30 FPS streaming via WebSocket
- **Encoding**: JPEG compression + Base64 for web transfer

### Chemistry Engine
- **11 Chemicals**: HCl, H₂SO₄, HNO₃, CH₃COOH, H₂O, NaOH, KOH, NH₃, NaCl, PP, MO
- **pH Calculation**: Based on molarity and volume
- **Acid Types**: Strong (Ka→∞) and weak (Ka=1.8×10⁻⁵)
- **Base Types**: Strong (Kb→∞) and weak (Kb=1.8×10⁻⁵)
- **Indicators**: Fenolftalein (pH 8.3), Metil Orange (pH 3.1-4.4)

### State Management
- **Real-time Updates**: Mixture composition tracking
- **History Log**: Last 10 reactions stored
- **Thread-safe**: Async/await FastAPI patterns

---

## 🎨 Frontend Features

### Header
- **SOLVIA Branding**: Sparkle icon + gradient text
- **AI Status Indicator**: Green (safe) / Red (danger) with pulse
- **Real-time Clock**: Updates every second

### Main Layout (70/30 Split)

#### Left Panel (70%)
- **Live Camera Feed**: 
  - MediaPipe hand overlay
  - Corner brackets (futuristic)
  - Recording indicator
  - Timestamp display

#### Right Panel (30%)

**1. pH Meter**
- Circular gauge visualization
- Color gradient: Red→Orange→Yellow→Green→Blue→Purple
- Real-time value: 0.0-14.0 with 1 decimal
- Acid/Neutral/Base label
- pH scale slider

**2. Reaction Log**
- Scrollable list (max 10 entries)
- Timestamp + chemical equation
- Auto-scroll to latest

**3. Safety Alert**
- Normal state: Green checkmark
- Danger state: Red warning (pulse animation)
- YOLOv5 integration ready

**4. Control Buttons**
- Reset Lab (Orange/Red gradient)
- Take Screenshot (Cyan/Blue gradient)
- Hover effects + scale animation

### Theme
- **Primary**: Midnight Blue (#0c1e3a)
- **Accent**: Cyan (#00d4ff)
- **Background**: Gradient slate-950 → blue-950
- **Glass-morphism**: backdrop-blur effects
- **Shadows**: Neon glow effects

---

## ⚗️ Chemistry Engine

### Strong Acid Calculation

```python
# Example: HCl (completely dissociates)
# HCl → H⁺ + Cl⁻

# Given: 10 mL of 1M HCl
volume_L = 10 / 1000  # Convert to liters
molarity = 1.0

H_plus_moles = molarity * volume_L  # 0.01 moles
H_plus_concentration = H_plus_moles / volume_L  # 1.0 M

pH = -log₁₀(H_plus_concentration)  # pH = 0.0
```

### Weak Acid Calculation

```python
# Example: CH₃COOH (partial dissociation)
# CH₃COOH ⇌ H⁺ + CH₃COO⁻
# Ka = 1.8 × 10⁻⁵

# Given: 10 mL of 0.1M CH₃COOH
Ka = 1.8e-5
molarity = 0.1

# Using approximation
H_plus_concentration = sqrt(Ka * molarity)  # ≈ 1.34 × 10⁻³ M

pH = -log₁₀(H_plus_concentration)  # pH ≈ 2.87
```

### Neutralization

```python
# Example: HCl + NaOH → NaCl + H₂O

# Step 1: Add 10 mL of 1M HCl
H_plus_moles = 0.01

# Step 2: Add 10 mL of 1M NaOH  
OH_minus_moles = 0.01

# Calculate net
if H_plus_moles == OH_minus_moles:
    pH = 7.0  # Perfect neutralization
elif H_plus_moles > OH_minus_moles:
    net_H = H_plus_moles - OH_minus_moles
    pH = -log₁₀(net_H / total_volume_L)
else:
    net_OH = OH_minus_moles - H_plus_moles
    pOH = -log₁₀(net_OH / total_volume_L)
    pH = 14 - pOH
```

### Indicator Behavior

```python
# Phenolphthalein (PP)
if pH < 8.3:
    color = "colorless"
else:
    color = "pink"

# Methyl Orange (MO)
if pH < 3.1:
    color = "red"
elif pH > 4.4:
    color = "yellow"
else:
    color = "orange"
```

---

## 🔌 WebSocket Protocol

### Connection
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/camera')
```

### Message Format (Server → Client)

```json
{
  "frame": "base64_encoded_jpeg_string",
  "hand_data": {
    "hands_detected": true,
    "landmarks": [
      [
        {"x": 0.5, "y": 0.3, "z": -0.02},
        // ... 21 landmarks per hand
      ]
    ],
    "gesture": "pinch"  // or "open", "none"
  },
  "mixture_state": {
    "components": [
      {
        "chemical_id": "HCl",
        "volume": 10.0,
        "molarity": 1.0
      }
    ],
    "total_volume": 10.0,
    "current_pH": 1.0,
    "current_color": [0, 0, 200],  // BGR format
    "reaction_name": "Asam Klorida (HCl)",
    "description": "Asam kuat, Ka sangat besar (pH 1.00)",
    "timestamp": "2025-12-23T10:30:00.123456"
  },
  "safety_status": "safe",  // or "danger"
  "timestamp": "2025-12-23T10:30:00.123456"
}
```

### Frame Rate Control
- **Server**: Sends 30 FPS (await asyncio.sleep(1/30))
- **Client**: Displays immediately upon receipt

---

## 📡 API Reference

### REST Endpoints

#### Health Check
```http
GET /
Response: {
  "message": "SOLVIA Backend API",
  "version": "1.0.0",
  "status": "running"
}
```

#### Get Chemicals
```http
GET /api/chemicals
Response: {
  "chemicals": {
    "HCl": { ... },
    "NaOH": { ... },
    ...
  }
}
```

#### Add Chemical
```http
POST /api/mixture/add
Body: {
  "chemical_id": "HCl",
  "volume": 10.0,
  "molarity": 1.0
}
Response: {
  "success": true,
  "mixture_state": { ... },
  "reaction_log": [ ... ]
}
```

#### Get Mixture State
```http
GET /api/mixture/state
Response: {
  "mixture_state": { ... },
  "reaction_log": [ ... ]
}
```

#### Reset Mixture
```http
POST /api/mixture/reset
Response: {
  "success": true,
  "message": "Mixture reset successfully",
  "mixture_state": { ... }
}
```

#### Get Safety Status
```http
GET /api/safety/status
Response: {
  "status": "safe",
  "message": "All systems normal",
  "timestamp": "2025-12-23T10:30:00"
}
```

---

## 🚀 Deployment

### Development

```bash
# Terminal 1: Backend
cd api
python main.py

# Terminal 2: Frontend
npm run dev
```

### Production

#### Backend (Docker)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY api/requirements.txt .
RUN pip install -r requirements.txt
COPY api/ .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Frontend (Vercel)
```bash
npm run build
npm start
```

### Environment Variables

**.env.local** (Frontend)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

---

## 📊 Performance Metrics

- **WebSocket Latency**: < 50ms
- **Frame Processing**: 30 FPS (33ms per frame)
- **pH Calculation**: < 1ms
- **REST API Response**: < 10ms

---

## 🔐 Security Considerations

1. **CORS**: Restricted to localhost:3000 (development)
2. **WebSocket**: No authentication (add JWT for production)
3. **Input Validation**: Pydantic models enforce types
4. **Rate Limiting**: Not implemented (add for production)

---

## 📚 References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands)
- [Next.js Documentation](https://nextjs.org/docs)
- [Chemistry pH Calculations](https://chem.libretexts.org/)

---

**SOLVIA Technical Documentation v1.0**
*Created: December 23, 2025*
