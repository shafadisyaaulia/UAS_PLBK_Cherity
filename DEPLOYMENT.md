# 🚀 CHERITY Deployment Guide

## Deployment Architecture

```
Frontend (Next.js) → Vercel
Backend (FastAPI)   → Railway / Render
```

---

## 📦 Frontend Deployment (Vercel)

### Automatic Deployment via GitHub

1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Final production build"
   git push origin main
   ```

2. **Connect to Vercel**
   - Login ke [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select GitHub repository
   - Vercel akan auto-detect Next.js

3. **Environment Variables (Optional)**
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```

4. **Deploy**
   - Vercel akan otomatis build & deploy
   - URL production: `https://cherity-lab.vercel.app`

### Manual CLI Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Domain akan otomatis: cherity-xyz.vercel.app
```

---

## 🐍 Backend Deployment (Railway)

### Method 1: GitHub Integration

1. **Prepare Railway**
   - Login ke [railway.app](https://railway.app)
   - Create new project
   - Select "Deploy from GitHub"
   - Choose repository

2. **Configuration**
   - Root Directory: `api`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   
3. **Environment Variables**
   ```env
   PYTHONUNBUFFERED=1
   PORT=8000
   ```

4. **Deploy**
   - Railway akan build dengan Dockerfile
   - URL backend: `https://cherity-api.up.railway.app`

### Method 2: Docker Manual Deploy

```bash
# Build Docker image
cd api
docker build -t cherity-backend .

# Test locally
docker run -p 8000:8000 cherity-backend

# Push to registry (Railway/Render compatible)
docker tag cherity-backend registry.railway.app/cherity-backend
docker push registry.railway.app/cherity-backend
```

---

## 🔧 Backend Deployment (Render)

### Alternative to Railway

1. **Create Web Service**
   - Login ke [render.com](https://render.com)
   - New → Web Service
   - Connect GitHub repository

2. **Configuration**
   ```yaml
   Name: cherity-backend
   Region: Singapore
   Branch: main
   Root Directory: api
   Runtime: Docker
   Instance Type: Free
   ```

3. **Environment Variables**
   ```env
   PYTHON_VERSION=3.10
   PORT=8000
   ```

4. **Deploy**
   - Render akan auto-detect Dockerfile
   - URL: `https://cherity-backend.onrender.com`

---

## 🔗 Connect Frontend to Backend

### Update Frontend API URL

1. **Vercel Environment Variables**
   ```env
   NEXT_PUBLIC_API_URL=https://cherity-api.up.railway.app
   ```

2. **Update WebSocket Hook** (if needed)
   ```typescript
   // app/hooks/useCherityWebSocket.ts
   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'ws://localhost:8000'
   ```

3. **Redeploy Frontend**
   ```bash
   vercel --prod
   ```

---

## ✅ Post-Deployment Checklist

- [ ] Frontend accessible at Vercel URL
- [ ] Backend accessible at Railway/Render URL
- [ ] WebSocket connection working
- [ ] Camera permission modal appears
- [ ] Gesture detection functional
- [ ] pH meter updates in real-time
- [ ] Screenshot download works
- [ ] Beaker visualization animates
- [ ] No CORS errors in console

---

## 🐛 Troubleshooting

### Frontend Issues

**Error: "Failed to fetch"**
```bash
# Check NEXT_PUBLIC_API_URL is set correctly
echo $NEXT_PUBLIC_API_URL

# Verify backend is running
curl https://your-backend.railway.app/health
```

**Error: "WebSocket connection failed"**
- Backend might be using HTTP only
- Upgrade to HTTPS (Railway/Render auto-provide)
- Update WebSocket URL from `ws://` to `wss://`

### Backend Issues

**Error: "Port already in use"**
```bash
# Railway/Render auto-assign PORT
# Make sure using $PORT env variable
```

**Error: "Module not found"**
```bash
# Verify all dependencies in requirements.txt
pip freeze > api/requirements.txt
```

---

## 📊 Monitoring

### Railway Dashboard
- Monitor CPU/Memory usage
- View deployment logs
- Check request metrics

### Vercel Analytics
- Track page views
- Monitor performance
- Check error rates

---

## 🔐 Security

1. **Environment Variables**
   - Never commit `.env` files
   - Use platform secrets manager

2. **CORS Configuration**
   ```python
   # api/main.py already configured
   origins = [
       "https://cherity-lab.vercel.app",
       "http://localhost:3000"
   ]
   ```

3. **Rate Limiting** (Optional)
   ```python
   from slowapi import Limiter
   limiter = Limiter(key_func=get_remote_address)
   ```

---

## 📝 Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add custom domain (e.g., `cherity.app`)
3. Update DNS records
4. Vercel auto-provisions SSL

### Railway
1. Settings → Domains
2. Add custom domain
3. Add CNAME record to Railway domain
4. SSL auto-enabled

---

## 🎯 Production Optimization

### Frontend
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-backend.railway.app'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}
```

### Backend
```python
# api/main.py
import logging
logging.basicConfig(level=logging.WARNING)  # Production level
```

---

**CHERITY** © 2025 | Ready for Production 🚀
