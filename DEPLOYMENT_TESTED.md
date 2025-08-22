# ✅ DEPLOYMENT COMMANDS - TESTED & VERIFIED

## 🚀 All Commands Successfully Tested (August 22, 2025)

### 📋 **SERVER DEPLOYMENT COMMANDS**

#### **1. Build Process**

```bash
cd server
npm run build
```

✅ **Status**: WORKING

- Compiles TypeScript to JavaScript
- Creates `dist/` folder with compiled files
- Main file location: `dist/src/main.js`

#### **2. Production Start Command**

```bash
cd server
npm run start:prod
```

✅ **Status**: WORKING

- Fixed script path: `node dist/src/main.js`
- Server starts on port 8000
- All routes properly mapped
- Health check available at `/health`

#### **3. Development Start Command**

```bash
cd server
npm run start:dev
```

✅ **Status**: WORKING

- Uses TypeScript source files directly
- Hot reload enabled
- Detailed logging enabled

#### **4. Direct Node Command**

```bash
cd server
node dist/src/main.js
```

✅ **Status**: WORKING

- Direct execution of compiled JavaScript
- Same functionality as `npm run start:prod`

### 📋 **CLIENT DEPLOYMENT COMMANDS**

#### **1. Build Process**

```bash
cd client
npm run build
```

✅ **Status**: WORKING

- Creates optimized production build
- Static pages pre-rendered
- Middleware compiled (33.9 kB)
- Total bundle size: ~123 kB

#### **2. Development Start Command**

```bash
cd client
npm run dev
```

✅ **Status**: WORKING

- Development server on http://localhost:3000
- Hot reload enabled
- Environment variables loaded

### 🔧 **RENDER DEPLOYMENT CONFIGURATION**

#### **Option 1: Web Dashboard (if still having issues)**

#### **Build Command**

```
npm run build
```

⚠️ **IMPORTANT**: Use `npm run build` NOT `npx nest build` directly. The npm script handles the npx execution.

#### **Start Command**

```
npm run start:prod
```

#### **Root Directory**

```
server
```

#### **Option 2: Render CLI (RECOMMENDED)**

If web deployment keeps failing, use the Render CLI for better control:

**Step 1: Install Render CLI**

Since there's no Windows binary, you have two options:

**Option A: Use Linux binary with WSL (if you have WSL installed)**
```bash
# In WSL terminal
curl -L https://github.com/render-oss/cli/releases/download/v2.1.4/cli_2.1.4_linux_amd64.zip -o render-cli.zip
unzip render-cli.zip
sudo mv cli_2.1.4_linux_amd64 /usr/local/bin/render
render --version
```

**Option B: Manual Web Service Creation (EASIER)**
Instead of CLI, use the web dashboard with exact settings:

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `https://github.com/Hasib2202/auth-subdomain-app`
4. **IMPORTANT SETTINGS:**
   - **Name**: `auth-subdomain-server` (or your choice)
   - **Runtime**: `Node`
   - **Root Directory**: `server` (THIS IS CRITICAL)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Plan**: `Free`

**Step 2: Environment Variables (CRITICAL)**
Add these in Render dashboard under Environment:
```
DATABASE_URL=postgresql://[your-complete-db-url]
JWT_SECRET=your-secret-key-here
NODE_ENV=production
PORT=10000
```

**Step 3: Deploy**
Click "Create Web Service" and monitor the deploy logs.

#### **Environment Variables Required**

```
DATABASE_URL=postgresql://[your-database-url]
JWT_SECRET=your-jwt-secret-key
NODE_ENV=production
```

### 🌐 **VERCEL DEPLOYMENT CONFIGURATION**

#### **Build Command**

```
npm run build
```

#### **Root Directory**

```
client
```

#### **Framework Preset**

```
Next.js
```

### ✅ **VERIFICATION TESTS COMPLETED**

#### **Server Tests**

- ✅ Build process completes successfully
- ✅ Production server starts without errors
- ✅ Health endpoint responds: `http://localhost:8000/health`
- ✅ Root endpoint responds: `http://localhost:8000`
- ✅ All authentication routes mapped correctly
- ✅ CORS configuration active
- ✅ Database connection ready
- ✅ JWT middleware loaded

#### **Client Tests**

- ✅ Build process creates optimized bundle
- ✅ Development server starts on port 3000
- ✅ All pages compile successfully
- ✅ Middleware configuration working
- ✅ Environment variables loaded

### 📝 **DEPLOYMENT READY STATUS**

**Backend (NestJS)** ✅ READY FOR RENDER

- All build/start commands tested
- Package.json dependencies fixed
- Production start script corrected
- Health checks functional
- ✅ **CRITICAL FIX**: npx prefix added to nest commands to prevent "nest: not found" errors on Render

**Frontend (Next.js)** ✅ READY FOR VERCEL

- Build optimization successful
- All routes pre-rendered where possible
- Development environment tested

### 🎯 **NEXT STEPS FOR DEPLOYMENT**

1. **Set up DATABASE_URL** with complete PostgreSQL connection string
2. **Deploy backend to Render** using manual web service
3. **Update frontend environment variables** with deployed backend URL
4. **Deploy frontend to Vercel**
5. **Configure custom domain** (optional)

### 🚨 **COMMON DEPLOYMENT ERRORS & FIXES**

#### **Error**: `npm error could not determine executable to run`

**Cause**: Using `npx nest build` directly in Render build command
**Fix**: Use `npm run build` instead (which internally runs `npx nest build`)

#### **Error**: `sh: 1: nest: not found`

**Cause**: Using `nest build` without npx prefix
**Fix**: Ensure package.json uses `npx nest build` in scripts

#### **Error**: `Cannot find module '/opt/render/project/src/server/dist/main.js'`

**Cause**: Incorrect start script path
**Fix**: Use `node dist/src/main.js` in start:prod script

---

**Last Tested**: August 22, 2025 5:05 PM
**Status**: ALL SYSTEMS GO! 🚀
**Latest Fix**: Clarified Render build command should be `npm run build` not `npx nest build`
