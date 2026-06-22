# 🚀 Vercel Deployment Guide for Nanos E-Commerce API

## 🔧 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional): `npm install -g vercel`
3. **MongoDB Atlas**: Ensure your database allows connections from anywhere (0.0.0.0/0) for Vercel

---

## 📝 Step-by-Step Deployment

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect Repository**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub/GitLab/Bitbucket repository
   - Or upload the project folder directly

2. **Configure Project Settings**
   - **Framework Preset**: Select "Other"
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: Leave empty (no build needed)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

3. **Set Environment Variables** ⚠️ **CRITICAL**
   
   Add these in Vercel Dashboard → Project Settings → Environment Variables:

   ```env
   # Application
   NODE_ENV=production
   PORT=5000
   API_PREFIX=/api/v1
   
   # MongoDB
   MONGODB_URI=mongodb+srv://nanos:wj3pA0n4BSsKeEXQ@cluster0.szupyhn.mongodb.net/
   
   # JWT Secrets (CHANGE THESE!)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   JWT_RESET_PASSWORD_EXPIRES_IN=15m
   
   # Super Admin Credentials
   SUPER_ADMIN_FIRST_NAME=Super
   SUPER_ADMIN_LAST_NAME=Admin
   SUPER_ADMIN_EMAIL=superadmin@nanos.com
   SUPER_ADMIN_PASSWORD=SuperAdmin@123
   
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_EMAIL=nano.shop2027@gmail.com
   SMTP_PASSWORD=uhie prvz yzvp agpt
   EMAIL_FROM=nano.shop2027@gmail.com
   
   # ImageKit
   IMAGEKIT_PUBLIC_KEY=public_7AffB7JIpQH/7Ab6aEwEWGlMNII=
   IMAGEKIT_PRIVATE_KEY=private_ufCL2tlbeTg0R2GShb6ImpO5bU4=
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/3crxxgskp
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~1-2 minutes)
   - Your API will be live at `https://your-project.vercel.app`

---

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? nanos-ecommerce-api
# - Directory? ./
# - Override settings? No

# For production deployment
vercel --prod
```

---

## 🔍 Troubleshooting Common Issues

### Issue 1: "500 INTERNAL_SERVER_ERROR" or "FUNCTION_INVOCATION_FAILED"

**Causes:**
- Missing environment variables
- MongoDB connection timeout
- Mongoose version incompatibility

**Solutions:**
1. **Check Vercel Logs**:
   - Go to Vercel Dashboard → Project → Deployments
   - Click on the deployment → View Function Logs
   - Look for specific error messages

2. **Verify Environment Variables**:
   - All variables must be set in Vercel Dashboard
   - No `.env` file is used in production

3. **MongoDB Atlas Whitelist**:
   ```
   - Go to MongoDB Atlas
   - Network Access → Add IP Address
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Save
   ```

### Issue 2: Swagger UI Not Loading

**Cause:** Content Security Policy (CSP) blocking Swagger assets

**Solution:** Already handled in `api/index.js`:
```javascript
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
```

### Issue 3: Cold Start Timeouts

**Cause:** Serverless functions have a timeout (10s on free plan, 60s on pro)

**Solutions:**
- Database connection is cached between invocations
- Consider Vercel Pro for longer timeouts
- Optimize heavy operations

### Issue 4: File Upload Issues

**Cause:** Vercel serverless functions have limited file system access

**Solution:** Already using ImageKit for image storage (not local filesystem)

---

## 📊 Post-Deployment Checklist

After deployment, verify:

- [ ] ✅ **Health Check**: `https://your-app.vercel.app/health`
- [ ] ✅ **API Documentation**: `https://your-app.vercel.app/api-docs`
- [ ] ✅ **Root Endpoint**: `https://your-app.vercel.app/`
- [ ] ✅ **Test Registration**: POST `/api/v1/auth/register`
- [ ] ✅ **Test Login**: POST `/api/v1/auth/login`
- [ ] ✅ **Super Admin Login**: Use credentials from env vars
- [ ] ✅ **Check Logs**: Vercel Dashboard → Function Logs

---

## 🔒 MongoDB Atlas Configuration

### Allow Vercel IP Addresses

Since Vercel uses dynamic IPs, you must whitelist all IPs:

1. Go to MongoDB Atlas Dashboard
2. Click "Network Access" (left sidebar)
3. Click "Add IP Address"
4. Select "Allow Access from Anywhere"
5. Confirm with 0.0.0.0/0
6. Click "Confirm"

⚠️ **Security Note**: For production, consider:
- Using MongoDB Atlas VPC peering
- Implementing additional security layers (API keys, rate limiting)
- Our app already has rate limiting enabled

---

## 🌐 Accessing Your Deployed API

After deployment, your API will be available at:

```
Base URL: https://your-project-name.vercel.app

Endpoints:
- Documentation: https://your-project-name.vercel.app/api-docs
- Health Check: https://your-project-name.vercel.app/health
- API Routes:   https://your-project-name.vercel.app/api/v1/*
```

---

## 🔐 Security Recommendations for Production

1. **Change JWT Secrets**:
   ```env
   # Generate secure random strings
   JWT_SECRET=$(openssl rand -base64 64)
   JWT_REFRESH_SECRET=$(openssl rand -base64 64)
   ```

2. **Change Super Admin Password**:
   - Use a strong, unique password
   - Store securely in password manager

3. **Enable HTTPS Only** (Vercel does this automatically)

4. **Set Up Custom Domain**:
   - Vercel Dashboard → Project → Settings → Domains
   - Add your custom domain
   - Configure DNS records

5. **Monitor Function Logs**:
   - Regular check for errors
   - Set up log aggregation (optional)

6. **Rate Limiting**:
   - Already configured (100 req/15min)
   - Adjust in `api/index.js` if needed

---

## 📈 Performance Optimization

1. **Enable Caching**:
   - Vercel automatically caches static assets
   - Consider adding response caching for GET endpoints

2. **Database Indexing**:
   - Ensure MongoDB indexes are created
   - Check query performance

3. **Connection Pooling**:
   - Already optimized in `src/config/database.js`
   - maxPoolSize: 10 connections

---

## 🐛 Debugging Vercel Deployment

### View Logs in Real-Time

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# View logs
vercel logs your-deployment-url --follow
```

### Common Log Commands

```bash
# View last deployment logs
vercel logs

# View specific deployment
vercel logs <deployment-url>

# View production logs
vercel logs --prod
```

---

## 🚨 If Swagger Still Crashes

If Swagger specifically crashes, try accessing endpoints directly:

```bash
# Test health endpoint
curl https://your-app.vercel.app/health

# Test API registration
curl -X POST https://your-app.vercel.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Test@1234"
  }'
```

If regular endpoints work but Swagger doesn't:
1. Check Helmet CSP settings in `api/index.js`
2. View browser console for CSP errors
3. Check Vercel function logs for initialization errors

---

## 📞 Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Serverless Functions**: https://vercel.com/docs/functions
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **Vercel Community**: https://github.com/vercel/vercel/discussions

---

## ✅ Success Indicators

Your deployment is successful when:

1. ✅ Build completes without errors
2. ✅ All environment variables are set
3. ✅ Health endpoint returns 200 OK
4. ✅ Swagger UI loads at `/api-docs`
5. ✅ Database connection succeeds (check logs)
6. ✅ Super admin is auto-created on first request
7. ✅ Test endpoints return expected responses

---

**Happy Deploying! 🚀**

If you encounter issues, check:
1. Vercel Function Logs (most important!)
2. MongoDB Atlas Network Access
3. Environment Variables (all set correctly?)
4. Browser Console (for client-side errors)
