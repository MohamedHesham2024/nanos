#!/bin/bash

# Vercel Deployment Troubleshooting Script

echo "🔍 Nanos E-Commerce API - Vercel Troubleshooting"
echo "================================================"
echo ""

# Check if vercel.json exists
if [ -f "vercel.json" ]; then
  echo "✅ vercel.json found"
else
  echo "❌ vercel.json missing!"
  exit 1
fi

# Check if api/index.js exists
if [ -f "api/index.js" ]; then
  echo "✅ api/index.js found"
else
  echo "❌ api/index.js missing!"
  exit 1
fi

# Check for .env file (should NOT be deployed)
if [ -f ".env" ]; then
  echo "⚠️  .env file exists (will not be deployed to Vercel)"
  echo "   Make sure all environment variables are set in Vercel Dashboard!"
fi

# Check if .vercelignore exists
if [ -f ".vercelignore" ]; then
  echo "✅ .vercelignore found"
else
  echo "⚠️  .vercelignore missing (not critical)"
fi

echo ""
echo "📋 Required Environment Variables for Vercel:"
echo "--------------------------------------------"
cat << 'EOF'
✓ NODE_ENV
✓ MONGODB_URI
✓ JWT_SECRET
✓ JWT_REFRESH_SECRET
✓ JWT_EXPIRES_IN
✓ JWT_REFRESH_EXPIRES_IN
✓ SUPER_ADMIN_EMAIL
✓ SUPER_ADMIN_PASSWORD
✓ SUPER_ADMIN_FIRST_NAME
✓ SUPER_ADMIN_LAST_NAME
✓ SMTP_HOST
✓ SMTP_PORT
✓ SMTP_EMAIL
✓ SMTP_PASSWORD
✓ EMAIL_FROM
✓ IMAGEKIT_PUBLIC_KEY
✓ IMAGEKIT_PRIVATE_KEY
✓ IMAGEKIT_URL_ENDPOINT
EOF

echo ""
echo "🚀 Deployment Steps:"
echo "-------------------"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Click 'Add New Project'"
echo "3. Import your repository"
echo "4. Add all environment variables above"
echo "5. Deploy!"
echo ""
echo "📖 For detailed instructions, see VERCEL_DEPLOYMENT_GUIDE.md"
echo ""
