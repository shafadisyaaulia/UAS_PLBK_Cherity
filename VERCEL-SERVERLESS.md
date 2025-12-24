# 🚀 Vercel Serverless Backend - Setup Guide

## ✅ Yang Sudah Dikonfigurasi:

### 1. **Struktur Serverless**
- `api/index.py` - Main serverless handler (FastAPI)
- `requirements-vercel.txt` - Lightweight dependencies
- `vercel.json` - Routing configuration

### 2. **Features Available (Serverless Mode)**
✅ Chemistry API endpoints
✅ Chemical database
✅ Mixture calculations
✅ pH calculations
✅ Experiment data
✅ Auto-deploy dari GitHub

### 3. **Features Limited (Use Local Mode)**
⚠️ WebSocket (gunakan polling sebagai gantinya)
❌ Camera CV detection (butuh local untuk YOLOv5)
❌ Heavy ML models (size limit 50MB)

---

## 📦 Deployment Steps:

### **Step 1: Update Dependencies**
```powershell
cd "C:\INFORMATIKA\SEMESTER 5\Viskom\AI-Safe"

# Add mangum to main requirements
echo "mangum==0.17.0" >> api/requirements.txt
```

### **Step 2: Commit & Push**
```powershell
git add .
git commit -m "feat: Add Vercel Serverless backend support"
git push origin main
```

### **Step 3: Configure Vercel**

Di Vercel Dashboard:
1. Go to Project Settings
2. **Functions** tab
3. Pastikan Python runtime enabled
4. **Environment Variables** → Add:
   ```
   PYTHON_VERSION=3.9
   ```

### **Step 4: Redeploy**
Vercel akan auto-deploy backend sebagai serverless functions!

**Backend URL:** `https://your-vercel-app.vercel.app/api`

---

## 🌐 API Endpoints (Serverless):

### Base URL: `https://your-app.vercel.app`

```
GET  /                          → Service info
GET  /health                    → Health check
GET  /api/chemicals             → List chemicals
GET  /api/chemicals/{id}        → Get chemical info
POST /api/mixture/add           → Add chemical to mixture
GET  /api/mixture/state         → Get current mixture
POST /api/mixture/reset         → Reset mixture
GET  /api/experiments           → List experiments
GET  /docs                      → API documentation
```

---

## 🔧 Frontend Integration:

Backend URL otomatis jadi **same domain** dengan frontend!

Update file yang pakai API:
```typescript
// OLD (separate backend):
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// NEW (serverless - same domain):
const API_URL = '' // Empty = same domain!

// Requests:
fetch('/api/chemicals')         // ✅ Works!
fetch('/api/mixture/add', {...}) // ✅ Works!
```

---

## ⚡ Performance:

| Feature | Serverless | Local Backend |
|---------|-----------|---------------|
| **Startup** | ~1-3 sec (cold start) | Instant |
| **API Response** | ~100-500ms | ~50ms |
| **CV Detection** | ❌ Not available | ✅ Real-time |
| **WebSocket** | ⚠️ Limited | ✅ Full support |
| **Cost** | FREE | FREE |
| **Deploy** | Auto (GitHub) | Manual |

---

## 🎯 Hybrid Approach (RECOMMENDED):

### **For Demo/UAS:**
1. **Deploy frontend + API to Vercel** (serverless)
2. **Run CV detection locally** saat demo
3. Frontend tetap bisa pakai `/api` endpoints
4. Untuk fitur camera, gunakan local mode

### **Commands:**
```powershell
# Local backend (for CV features):
cd "C:\INFORMATIKA\SEMESTER 5\Viskom\AI-Safe"
.\start-backend.ps1

# Frontend auto-detect:
# - If local backend running → use http://localhost:8000
# - If not → use Vercel serverless /api
```

---

## 📊 File Changes Summary:

### New Files:
- ✅ `api/index.py` - Serverless FastAPI handler
- ✅ `requirements-vercel.txt` - Lightweight deps
- ✅ `VERCEL-SERVERLESS.md` - This guide

### Modified Files:
- ✅ `vercel.json` - Added Python functions config
- ✅ API endpoints optimized for serverless

---

## 🔄 Auto-Deploy Flow:

```
Push to GitHub
    ↓
Vercel detects change
    ↓
Build Frontend (Next.js)
    ↓
Build Backend (Python serverless)
    ↓
Deploy both together
    ↓
Live at: your-app.vercel.app ✅
```

---

## 🆘 Troubleshooting:

### Issue: "Function timeout"
**Solution:** Serverless functions have 10-30s timeout. Heavy computations (CV) perlu local mode.

### Issue: "Module not found"
**Solution:** Pastikan semua deps ada di `requirements-vercel.txt`

### Issue: "Cold start slow"
**Solution:** Normal untuk serverless. First request ~3 detik, subsequent requests cepat.

---

## ✅ Benefits:

1. **No separate backend hosting** - All in Vercel
2. **No CC required** - Vercel free tier
3. **Auto HTTPS** - SSL certificate gratis
4. **Auto-deploy** - Push to GitHub = live
5. **Same domain** - No CORS issues
6. **Global CDN** - Fast worldwide

---

## 💡 Next Steps:

1. Commit & push changes
2. Vercel auto-deploy (~2 min)
3. Test API: `https://your-app.vercel.app/api/chemicals`
4. Update frontend to use `/api` instead of external URL
5. For CV features: Run local backend saat demo

---

**Deploy sekarang?** Push ke GitHub dan tunggu Vercel magic! 🚀
