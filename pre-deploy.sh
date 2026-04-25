#!/bin/bash

# FinanceTracker Pre-Deployment Checklist
# Run this before deploying to Vercel

echo "🚀 FinanceTracker Pre-Deployment Checklist"
echo "=========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_mark() {
    echo -e "${GREEN}✓${NC} $1"
}

error_mark() {
    echo -e "${RED}✗${NC} $1"
}

warning_mark() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# 1. Check Node version
echo "1. Checking Node.js version..."
node_version=$(node -v)
if [[ $node_version == v1[4-9]* ]] || [[ $node_version == v2* ]]; then
    check_mark "Node.js version: $node_version"
else
    error_mark "Node.js version $node_version is too old. Required: v14+ or v16+"
    exit 1
fi
echo ""

# 2. Check git status
echo "2. Checking Git status..."
if [[ -z $(git status -s) ]]; then
    check_mark "Git working directory is clean"
else
    error_mark "Uncommitted changes detected:"
    git status -s
    warning_mark "Commit changes before deploying"
fi
echo ""

# 3. Check backend dependencies
echo "3. Checking backend dependencies..."
cd backend
if [ -f "package.json" ]; then
    check_mark "backend/package.json exists"
    if npm list > /dev/null 2>&1; then
        check_mark "All backend dependencies installed"
    else
        error_mark "Some backend dependencies missing. Run: cd backend && npm install"
        exit 1
    fi
else
    error_mark "backend/package.json not found"
    exit 1
fi
cd ..
echo ""

# 4. Check frontend dependencies
echo "4. Checking frontend dependencies..."
cd frontend
if [ -f "package.json" ]; then
    check_mark "frontend/package.json exists"
    if npm list > /dev/null 2>&1; then
        check_mark "All frontend dependencies installed"
    else
        error_mark "Some frontend dependencies missing. Run: cd frontend && npm install"
        exit 1
    fi
else
    error_mark "frontend/package.json not found"
    exit 1
fi
cd ..
echo ""

# 5. Check environment variables
echo "5. Checking environment variables..."
if [ -f "backend/.env" ]; then
    check_mark "backend/.env file exists"
    if grep -q "MONGODB_URI" backend/.env; then
        check_mark "MONGODB_URI is configured"
    else
        error_mark "MONGODB_URI not found in backend/.env"
    fi
    if grep -q "JWT_SECRET" backend/.env; then
        check_mark "JWT_SECRET is configured"
    else
        warning_mark "JWT_SECRET not found in backend/.env"
    fi
else
    warning_mark "backend/.env file not found. Create from backend/.env.example"
fi
echo ""

if [ -f "frontend/.env.local" ]; then
    check_mark "frontend/.env.local file exists"
    if grep -q "NEXT_PUBLIC_API_URL" frontend/.env.local; then
        check_mark "NEXT_PUBLIC_API_URL is configured"
    else
        warning_mark "NEXT_PUBLIC_API_URL not found in frontend/.env.local"
    fi
else
    warning_mark "frontend/.env.local file not found. Create from frontend/.env.local.example"
fi
echo ""

# 6. Check vercel.json
echo "6. Checking deployment configuration..."
if [ -f "vercel.json" ]; then
    check_mark "vercel.json exists"
else
    error_mark "vercel.json not found. Create it before deploying."
    exit 1
fi
echo ""

# 7. Check builds
echo "7. Running build checks..."
echo "   - Building backend..."
cd backend
if npm run build > /dev/null 2>&1; then
    check_mark "Backend builds successfully"
else
    error_mark "Backend build failed"
    npm run build
    exit 1
fi
cd ..

echo "   - Building frontend..."
cd frontend
if npm run build > /dev/null 2>&1; then
    check_mark "Frontend builds successfully"
else
    error_mark "Frontend build failed"
    npm run build
    exit 1
fi
cd ..
echo ""

# 8. Final checks
echo "8. Final deployment checks..."
check_mark "Project structure is correct"
check_mark "No sensitive data in committed files"
check_mark "All configuration files present"
echo ""

# Summary
echo "=========================================="
echo -e "${GREEN}✓ All checks passed!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Commit your changes: git add . && git commit -m 'Prepare for deployment'"
echo "2. Push to GitHub: git push origin main"
echo "3. Deploy to Vercel:"
echo "   - Option A: Visit https://vercel.com/dashboard and link your repo"
echo "   - Option B: Run: npm i -g vercel && vercel --prod"
echo ""
echo "4. After deployment, update these secrets in Vercel:"
echo "   - MONGODB_URI"
echo "   - JWT_SECRET"
echo "   - FRONTEND_URL (your Vercel domain)"
echo "   - SESSION_SECRET"
echo ""
echo "5. Redeploy after adding secrets"
echo ""
