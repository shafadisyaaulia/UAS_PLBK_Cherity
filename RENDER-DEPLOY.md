# 🚀 Deploy Backend ke Render.com (FREE)

## ✅ Kenapa Render?
- ✅ **100% GRATIS** - Tidak ada trial period
- ✅ **Tanpa Credit Card** - Langsung deploy
- ✅ **750 jam/bulan** - Cukup untuk project pribadi
- ✅ **Auto-deploy** dari GitHub
- ✅ **HTTPS gratis** - SSL certificate otomatis
- ⚠️ **Auto-sleep** setelah 15 menit tidak aktif (restart otomatis saat ada request)

---

## 📋 Step-by-Step Deploy Backend

### **Step 1: Create Render Account**
1. Buka https://render.com/
2. Klik **"Get Started"**
3. **Sign up with GitHub** (paling mudah)
4. Authorize Render untuk akses repo kamu

---

### **Step 2: Create Web Service**

1. Di Render Dashboard, klik **"New +"** → **"Web Service"**

2. **Connect Repository:**
   - Klik "Configure Account" kalau belum connect
   - Pilih repository **SOLVIA**
   - Klik "Connect"

3. **Configure Service:**
   ```
   Name: solvia-api
   Region: Singapore (paling dekat) atau Oregon (default)
   Branch: main
   Root Directory: api
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT
   ```

4. **Select Plan:**
   - Pilih **"Free"** (bukan yang $7)
   - Klik **"Create Web Service"**

5. **Tunggu deployment** (~3-5 menit)
   - Render akan auto-install dependencies
   - Build dan start server
   - Kasih kamu URL (contoh: `https://solvia-api.onrender.com`)

---

### **Step 3: Copy Backend URL**

Setelah deployment selesai:
1. Di Render dashboard, copy URL service kamu
2. Contoh: `https://solvia-api.onrender.com`
3. **SAVE URL ini** - nanti dipake di Vercel

---

### **Step 4: Update Vercel Environment Variable**

1. Buka https://vercel.com/dashboard
2. Pilih project **SOLVIA**
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://solvia-api.onrender.com
   Environment: Production, Preview, Development
   ```
5. **Save**
6. Go to **Deployments** → Pilih latest deployment → **"Redeploy"**

---

### **Step 5: Get Deploy Hook (untuk GitHub Actions)**

1. Di Render service page, klik **Settings** (sidebar)
2. Scroll ke **"Build & Deploy"** section
3. Copy **"Deploy Hook URL"**
   - Contoh: `https://api.render.com/deploy/srv_abc123?key=xyz789`
4. Ini akan dipake untuk auto-deploy dari GitHub

---

### **Step 6: Add GitHub Secret**

Buka: `https://github.com/shafadisyaaulia/SOLVIA/settings/secrets/actions`

**Add secret:**
```
Name: RENDER_DEPLOY_HOOK_URL
Value: (paste Deploy Hook URL dari Step 5)
```

---

### **Step 7: Update GitHub Secrets List**

Sekarang GitHub Secrets kamu perlu:

**Frontend (Vercel):**
- ✅ VERCEL_TOKEN
- ✅ VERCEL_ORG_ID
- ✅ VERCEL_PROJECT_ID

**Backend (Render):**
- ✅ RENDER_DEPLOY_HOOK_URL
- ✅ NEXT_PUBLIC_API_URL (URL Render)

**Yang TIDAK PERLU lagi:**
- ❌ RAILWAY_TOKEN (skip)
- ❌ RAILWAY_SERVICE_NAME (skip)

---

## 🔧 Environment Variables di Render

Kalau backend butuh environment variables:

1. Di Render service page → **Environment** tab
2. Add variables yang diperlukan:
   ```
   PORT=10000 (auto-set by Render)
   PYTHON_VERSION=3.10.0
   ```

---

## ⚠️ Penting - Auto Sleep

Render free tier akan **sleep setelah 15 menit tidak ada traffic**.

**Dampak:**
- ❄️ First request setelah sleep: **~30 detik** (cold start)
- 🔥 Request selanjutnya: **Cepat** (server sudah bangun)

**Solusi (optional):**
- Gunakan cron job untuk ping server tiap 10 menit
- Atau biarkan sleep (gratis tanpa batas waktu)

---

## 🧪 Test Backend

Setelah deploy:

1. Buka: `https://solvia-api.onrender.com/docs`
2. Harusnya muncul **FastAPI Swagger UI**
3. Test endpoint `/api/health` atau yang lain

Kalau error 404, tunggu 2-3 menit lagi (masih deploying).

---

## 🚀 Auto-Deploy Setup

Setelah add `RENDER_DEPLOY_HOOK_URL` ke GitHub Secrets:

**Setiap push ke GitHub → Render auto-deploy backend!**

Cara kerja:
1. Push code → GitHub Actions jalan
2. GitHub Actions panggil Render Deploy Hook
3. Render pull latest code dan rebuild
4. Backend updated otomatis

---

## 📊 Monitor Deployment

**Di Render Dashboard:**
- **Logs:** Lihat realtime logs saat deploy
- **Metrics:** CPU, Memory usage (gratis!)
- **Events:** History deployment
- **Shell:** SSH ke container (untuk debug)

---

## 🆘 Troubleshooting

### Problem: "Build failed"
**Solution:** 
- Cek Logs di Render
- Pastikan `requirements.txt` ada di folder `/api`
- Pastikan semua dependencies compatible

### Problem: "Application error"
**Solution:**
```bash
# Pastikan Start Command benar:
uvicorn server:app --host 0.0.0.0 --port $PORT
```

### Problem: "YOLOv5 model error"
**Solution:**
- Render free tier: 512MB RAM (mungkin kurang untuk YOLOv5)
- Alternative: Deploy model detection sebagai separate service
- Atau gunakan model yang lebih kecil

### Problem: "Frontend can't connect to backend"
**Solution:**
1. Cek `NEXT_PUBLIC_API_URL` di Vercel
2. Pastikan no trailing slash: `https://api.onrender.com` (bukan `...com/`)
3. Pastikan backend service running (cek Render logs)

---

## 💡 Tips

1. **Warm-up endpoint:** Buat endpoint `/health` untuk cron job ping
2. **Logs:** Render keep logs for 7 days (free tier)
3. **Custom domain:** Bisa add custom domain di Render Settings
4. **Upgrade:** Kalau perlu 24/7 uptime, upgrade ke $7/month (no sleep)

---

## ✅ Final Checklist

- [ ] Render account created
- [ ] Backend deployed to Render
- [ ] Backend URL copied
- [ ] `NEXT_PUBLIC_API_URL` added to Vercel
- [ ] Vercel redeployed
- [ ] `RENDER_DEPLOY_HOOK_URL` added to GitHub Secrets
- [ ] Backend accessible at `/docs` endpoint
- [ ] Frontend can connect to backend
- [ ] Test camera detection working

---

**Done!** Backend kamu sekarang running 100% gratis di Render! 🎉

**Comparison:**

| Feature | Railway (Trial) | Render (Free Forever) |
|---------|-----------------|----------------------|
| Cost | $5 credit → Habis | FREE selamanya |
| Uptime | 24/7 | Sleep after 15min idle |
| RAM | 8GB | 512MB |
| Deploy | Instant | ~3-5 min |
| Cold Start | - | ~30 sec |
| Best for | Production | Personal projects |

Untuk project UAS, **Render FREE tier sudah cukup!** ✅
