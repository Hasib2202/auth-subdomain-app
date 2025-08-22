# Render Deployment Configuration

## Database Setup (Done)
✅ PostgreSQL database created on Render

## Backend Deployment (Manual Steps)

### 1. Create Web Service
- Go to https://dashboard.render.com
- Click "New +" → "Web Service"
- Connect repository: `Hasib2202/auth-subdomain-app`

### 2. Configuration
- **Name**: `auth-server`
- **Branch**: `main`
- **Root Directory**: `server` (CRITICAL!)
- **Runtime**: `Node`
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `node dist/main.js`

### 3. Environment Variables
```
NODE_ENV=production
DATABASE_URL=[from PostgreSQL service]
JWT_SECRET=your-super-secret-jwt-key-for-production-2025
CORS_ORIGIN=https://auth-subdomain-client-mh3ehf9wt-hasib2202s-projects.vercel.app
```

### 4. Advanced Settings
- **Auto-Deploy**: Yes
- **Health Check Path**: `/health`

## Expected Behavior
With Root Directory set to `server`, all commands run from the server folder:
- `npm install` finds server/package.json
- `npm run build` creates server/dist/main.js
- `node dist/main.js` finds the file relative to server/ directory

## Troubleshooting
If it still fails, the issue might be:
1. Root Directory not properly set
2. Build not completing successfully  
3. Environment variables missing
4. Health check failing
