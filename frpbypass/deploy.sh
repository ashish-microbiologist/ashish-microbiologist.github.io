#!/bin/bash

# ====== GITHUB PAGES FIX DEPLOYMENT SCRIPT ======
# This script fixes the Access Denied problem

echo "🚀 FRP Bypass - GitHub Pages Fix Deployment"
echo "============================================"

# Step 1: Remove problematic files
echo "🗑️ Removing problematic files..."
rm -f .htaccess 2>/dev/null
rm -f _headers 2>/dev/null
rm -f Gemfile 2>/dev/null
rm -f Gemfile.lock 2>/dev/null

# Step 2: Create .nojekyll (CRITICAL)
echo "📄 Creating .nojekyll file..."
touch .nojekyll
echo "# This file disables Jekyll" > .nojekyll

# Step 3: Fix robots.txt
echo "🤖 Fixing robots.txt..."
cat > robots.txt << 'EOF'
User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://%username%.github.io/frp-bypass-ashish/sitemap.xml
EOF

# Step 4: Fix _config.yml
echo "⚙️ Fixing _config.yml..."
cat > _config.yml << 'EOF'
theme: jekyll-theme-cayman
markdown: kramdown
include: [".nojekyll", "robots.txt"]
exclude: ["README.md", "deploy.sh"]
EOF

# Step 5: Set correct permissions
echo "🔧 Setting file permissions..."
chmod 644 index.html
chmod 644 404.html
chmod 644 robots.txt
chmod 644 _config.yml
chmod 644 .nojekyll
chmod 644 css/style.min.css
chmod 644 js/script.min.js

# Step 6: Git commands
echo "📦 Committing to GitHub..."
git add .
git commit -m "FIX: GitHub Pages Access Denied problem - Added .nojekyll and fixed config"
git push origin main

echo ""
echo "✅ FIX APPLIED SUCCESSFULLY!"
echo "============================="
echo ""
echo "📌 WAIT 2-3 MINUTES for GitHub Pages to rebuild"
echo ""
echo "🌐 Your site will be available at:"
echo "   https://$(git config user.name).github.io/frp-bypass-ashish"
echo ""
echo "⚠️  If still getting 403 error:"
echo "   1. Go to GitHub Repository → Settings → Pages"
echo "   2. Under 'Branch', select 'main' and '/ (root)'"
echo "   3. Click Save"
echo "   4. Wait 2 minutes"
echo ""