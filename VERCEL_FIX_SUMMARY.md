# 🔧 Vercel Deployment - What Was Fixed

## ❌ The Problem

When deploying to Vercel, you got:
```
500: INTERNAL_SERVER_ERROR
Code: FUNCTION_INVOCATION_FAILED
```

This happened because:
1. ❌ Express apps need special configuration for Vercel's serverless platform
2. ❌ Your `src/app.js` was designed for traditional hosting (not serverless)
3. ❌ MongoDB connection wasn't optimized for serverless cold starts
4. ❌ Missing `vercel.json` configuration file

---

## ✅ The Solution

### 1. Created Serverless Function Entry Point

**File: `api/index.js`**
- Vercel requires all serverless functions in `/api` directory
- This file exports an async function handler
- Handles connection pooling and reuse between invocations
- Works both locally AND on Vercel

### 2. Added Vercel Configuration

**File: `vercel.json`**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ]
}
```

This tells Vercel:
- Build `api/index.js` as a Node.js serverless function
- Route ALL requests to this function

### 3. Optimized MongoDB for Serverless

**File: `src/config/database.js`**

Changes:
- ✅ Connection reuse (checks if already connected)
- ✅ Serverless-optimized options:
  - `bufferCommands: false` - No command buffering
  - `maxPoolSize: 10` - Limit connections
  - `serverSelectionTimeoutMS: 10000` - Faster timeouts
  - `socketTimeoutMS: 45000` - Prevent hanging
- ✅ No `process.exit()` in serverless mode
- ✅ Detects Vercel environment

### 4. Fixed Helmet CSP for Swagger

**In `api/index.js`:**
```javascript
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Swagger UI to load
    crossOriginEmbedderPolicy: false,
  })
);
```

This prevents Swagger from crashing due to Content Security Policy.

---

## 📁 New Files Created

1. **`vercel.json`** - Vercel deployment configuration
2. **`api/index.js`** - Serverless function entry point
3. **`.vercelignore`** - Files to exclude from deployment
4. **`VERCEL_DEPLOYMENT_GUIDE.md`** - Complete deployment instructions
5. **`check-vercel-setup.sh`** - Pre-deployment checklist script
6. **`VERCEL_FIX_SUMMARY.md`** - This file!

---

## 📁 Modified Files

1. **`src/config/database.js`** - Added serverless connection pooling
2. **`package.json`** - Added `vercel-dev` script

---

## 🚀 How to Deploy Now

### Option 1: Vercel Dashboard (Easiest)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your repository (or upload folder)
4. **IMPORTANT**: Add ALL environment variables:
   - Go to Project Settings → Environment Variables
   - Copy from your `.env` file
   - **Required variables**:
     ```
     NODE_ENV=production
     MONGODB_URI=mongodb+srv://...
     JWT_SECRET=...
     JWT_REFRESH_SECRET=...
     SUPER_ADMIN_EMAIL=...
     SUPER_ADMIN_PASSWORD=...
     SMTP_HOST=...
     SMTP_EMAIL=...
     SMTP_PASSWORD=...
     IMAGEKIT_PUBLIC_KEY=...
     IMAGEKIT_PRIVATE_KEY=...
     IMAGEKIT_URL_ENDPOINT=...
     ```
5. Click **"Deploy"**
6. Wait 1-2 minutes
7. Access your API at `https://your-project.vercel.app`

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## ✅ Testing After Deployment

### 1. Health Check
```bash
curl https://your-app.vercel.app/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running on Vercel",
  "timestamp": "2026-06-22T..."
}
```

### 2. Swagger Documentation
Visit: `https://your-app.vercel.app/api-docs`

Should show interactive API documentation.

### 3. Test Login
```bash
curl -X POST https://your-app.vercel.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@nanos.com",
    "password": "SuperAdmin@123"
  }'
```

### 4. Check Vercel Logs
- Go to Vercel Dashboard
- Click your deployment
- Click "Functions" tab
- View real-time logs

---

## 🔍 Still Having Issues?

### Check #1: Environment Variables
```bash
# In Vercel Dashboard → Project → Settings → Environment Variables
# Make sure ALL variables are set!
```

### Check #2: MongoDB Network Access
1. Go to MongoDB Atlas
2. Click "Network Access"
3. Add IP: **0.0.0.0/0** (Allow from anywhere)
4. This is required for Vercel's dynamic IPs

### Check #3: Vercel Function Logs
```bash
# Install Vercel CLI
npm install -g vercel

# View logs
vercel logs --prod
```

Look for errors like:
- `MongooseError: buffering timed out` → MongoDB connection issue
- `JWT_SECRET is not defined` → Missing env var
- `Cannot connect to database` → Check MongoDB whitelist

---

## 📊 What's Different in Serverless?

| Traditional Server | Vercel Serverless |
|-------------------|-------------------|
| Always running | Cold starts |
| Single instance | Multiple instances |
| Persistent connections | Connection pooling required |
| File system access | Read-only (except /tmp) |
| Long-running processes | 10s timeout (free), 60s (pro) |
| `app.listen(PORT)` | Export function handler |

---

## 🎯 Key Takeaways

1. ✅ **Vercel requires `api/` directory** for serverless functions
2. ✅ **MongoDB connections must be cached** (not recreated each time)
3. ✅ **Environment variables** must be in Vercel Dashboard (not .env)
4. ✅ **Helmet CSP** must be disabled for Swagger
5. ✅ **All routes** go through one serverless function
6. ✅ **Connection pooling** is critical for performance

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs/functions
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/
- **Deployment Guide**: See `VERCEL_DEPLOYMENT_GUIDE.md`
- **Troubleshooting**: Run `./check-vercel-setup.sh`

---

## 🎉 Success Checklist

Before considering deployment successful:

- [ ] ✅ `https://your-app.vercel.app/health` returns 200 OK
- [ ] ✅ `https://your-app.vercel.app/api-docs` loads Swagger UI
- [ ] ✅ Login works: `POST /api/v1/auth/login`
- [ ] ✅ Registration works: `POST /api/v1/auth/register`
- [ ] ✅ Super admin created (check logs)
- [ ] ✅ No errors in Vercel function logs
- [ ] ✅ Database connection successful (check logs)

---

**Your API is now ready for Vercel deployment! 🚀**

If you still get the 500 error after following these steps, please:
1. Check Vercel function logs (most important!)
2. Verify ALL environment variables are set
3. Confirm MongoDB allows connections from 0.0.0.0/0
4. Test the `/health` endpoint first before Swagger
