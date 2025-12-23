# 🚀 SOLVIA - Quick Reference

## Start Servers

```powershell
# Option 1: Both servers
.\start-solvia.ps1

# Option 2: Backend only
.\start-backend.ps1

# Option 3: Frontend only  
.\start-frontend.ps1

# Option 4: Manual
# Terminal 1:
cd api && python main.py

# Terminal 2:
npm run dev
```

## URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| WebSocket | ws://localhost:8000/ws/camera |

## API Quick Reference

```bash
# Health check
curl http://localhost:8000/

# Get chemicals
curl http://localhost:8000/api/chemicals

# Add HCl (10mL, 1M)
curl -X POST http://localhost:8000/api/mixture/add \
  -H "Content-Type: application/json" \
  -d '{"chemical_id":"HCl","volume":10,"molarity":1.0}'

# Get mixture state
curl http://localhost:8000/api/mixture/state

# Reset
curl -X POST http://localhost:8000/api/mixture/reset
```

## React Hook Usage

```typescript
import { useSolviaWebSocket } from './hooks/useSolviaWebSocket'

const { 
  isConnected,
  frame,
  mixtureState, 
  safetyStatus 
} = useSolviaWebSocket()

// Display camera
<img src={`data:image/jpeg;base64,${frame}`} />

// Display pH
<div>pH: {mixtureState?.current_pH.toFixed(2)}</div>
```

## Chemicals Database

| ID | Name | Type | pH |
|----|------|------|-----|
| HCl | Asam Klorida | strong_acid | 1.0 |
| H2SO4 | Asam Sulfat | strong_acid | 1.0 |
| HNO3 | Asam Nitrat | strong_acid | 1.0 |
| CH3COOH | Asam Asetat | weak_acid | 4.5 |
| H2O | Air | neutral | 7.0 |
| NaOH | Natrium Hidroksida | strong_base | 14.0 |
| KOH | Kalium Hidroksida | strong_base | 14.0 |
| NH3 | Amonia | weak_base | 11.0 |
| NaCl | Garam Dapur | salt_neutral | 7.0 |
| PP | Fenolftalein | indicator | 7.0 |
| MO | Metil Orange | indicator | 7.0 |

## Chemistry Examples

### Example 1: Strong Acid
```json
POST /api/mixture/add
{
  "chemical_id": "HCl",
  "volume": 10.0,
  "molarity": 1.0
}
// Result: pH ≈ 1.0
```

### Example 2: Neutralization
```json
// Step 1: Add HCl
{"chemical_id": "HCl", "volume": 10, "molarity": 1.0}
// pH ≈ 1.0

// Step 2: Add NaOH
{"chemical_id": "NaOH", "volume": 10, "molarity": 1.0}
// pH ≈ 7.0 (Neutral!)
```

### Example 3: Indicator
```json
// Add base
{"chemical_id": "NaOH", "volume": 10, "molarity": 0.1}

// Add phenolphthalein
{"chemical_id": "PP", "volume": 1, "molarity": 0.01}
// Result: Pink color (pH > 8.3)
```

## Test Commands

```bash
# Test API
python api/test_api.py

# Test WebSocket
npm install -g wscat
wscat -c ws://localhost:8000/ws/camera
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | `pip install -r api/requirements.txt` |
| Camera not opening | Change `cv2.VideoCapture(0)` to `(1)` or `(2)` |
| Port already in use | Kill process on port 8000 or 3000 |
| WebSocket disconnect | Check backend is running on port 8000 |

## File Locations

```
📁 Backend: api/main.py
📁 Frontend: app/page.tsx
📁 Hook: app/hooks/useSolviaWebSocket.ts
📁 Tests: api/test_api.py
📁 Docs: SETUP-BACKEND.md, TECHNICAL-DOCS.md
```

## Color Theme

```css
--midnight-blue: #0c1e3a
--cyan: #00d4ff
--background: gradient(slate-950 → blue-950)
--safe: #22c55e (green)
--danger: #ef4444 (red)
```

## Dependencies

**Backend:**
- fastapi
- uvicorn
- opencv-python
- mediapipe
- pydantic

**Frontend:**
- next.js
- react
- tailwindcss
- lucide-react

## Contact & Support

📚 **Docs**: [SETUP-BACKEND.md](SETUP-BACKEND.md)
🔧 **API**: http://localhost:8000/docs
📊 **Tech**: [TECHNICAL-DOCS.md](TECHNICAL-DOCS.md)

---

**SOLVIA v1.0** - December 23, 2025
