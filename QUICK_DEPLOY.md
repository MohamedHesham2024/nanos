# 🚀 Vercel Deployment - Quick Reference

## ⚡ TL;DR - Fix the 500 Error

Your app crashed on Vercel because it wasn't configured for serverless. Here's what was done:

### ✅ Files Added
- `vercel.json` - Tells Vercel how to build your app
- `api/index.js` - Serverless function entry point
- `.vercelignore` - What NOT to deploy
- Deployment guides and scripts

### ✅ Files Modified
- `src/config/database.js` - Optimized for serverless
- `package.json` - Added vercel-dev script

---

## 🎯 Deploy in 3 Steps

### Step 1: Go to Vercel
👉 https://vercel.com/dashboard

### Step 2: Add Environment Variables
**CRITICAL!** In Vercel Dashboard → Project Settings → Environment Variables:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://nanos:wj3pA0n4BSsKeEXQ@cluster0.szupyhn.mongodb.net/
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
SUPER_ADMIN_EMAIL=superadmin@nanos.com
SUPER_ADMIN_PASSWORD=SuperAdmin@123
SUPER_ADMIN_FIRST_NAME=Super
SUPER_ADMIN_LAST_NAME=Admin
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=nano.shop2027@gmail.com
SMTP_PASSWORD=uhie prvz yzvp agpt
EMAIL_FROM=nano.shop2027@gmail.com
IMAGEKIT_PUBLIC_KEY=public_7AffB7JIpQH/7Ab6aEwEWGlMNII=
IMAGEKIT_PRIVATE_KEY=private_ufCL2tlbeTg0R2GShb6ImpO5bU4=
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/3crxxgskp
API_PREFIX=/api/v1
PORT=5000
```

### Step 3: Deploy
Click "Deploy" button!

---

## 🔍 If Still Getting 500 Error

### Check MongoDB Whitelist
1. Go to MongoDB Atlas
2. Network Access → Add IP Address
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Save

### Check Vercel Logs
1. Vercel Dashboard → Your Project
2. Click latest deployment
3. Click "Functions" tab
4. Look for error messages

### Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `JWT_SECRET is not defined` | Add missing env var in Vercel |
| `MongooseError: buffering timed out` | Check MongoDB whitelist |
| `Cannot connect to database` | Verify MONGODB_URI in Vercel |
| `500 on /api-docs only` | Already fixed (Helmet CSP) |

---

## ✅ Test After Deployment

```bash
# Replace with your Vercel URL
VERCEL_URL="https://your-app.vercel.app"

# 1. Health Check
curl $VERCEL_URL/health

# 2. Swagger UI
open $VERCEL_URL/api-docs

# 3. Test Login
curl -X POST $VERCEL_URL/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@nanos.com","password":"SuperAdmin@123"}'
```

---

## 📚 Full Documentation

- **Complete Guide**: `VERCEL_DEPLOYMENT_GUIDE.md`
- **What Was Fixed**: `VERCEL_FIX_SUMMARY.md`
- **Pre-flight Check**: Run `./check-vercel-setup.sh`

---

## 🆘 Still Stuck?

1. **Check Vercel Function Logs** (90% of issues show here!)
2. **Verify ALL environment variables** are set
3. **MongoDB Network Access** must allow 0.0.0.0/0
4. **Try `/health` endpoint first** before Swagger

---

**Made with ❤️ for Nanos E-Commerce**
