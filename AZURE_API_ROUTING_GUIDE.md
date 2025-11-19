# Azure API Routing Configuration Guide

## Changes Made

### 1. Frontend Configuration Updates

**File: `Frontend/medisync/src/api.js`**
- Updated to use `VITE_API_BASE` environment variable
- Defaults to `http://localhost:5001` for local development
- Will use Azure URL when deployed

**File: `Frontend/medisync/vite.config.js`**
- Updated proxy configuration to support environment variables
- Can now proxy to different API endpoints based on deployment

### 2. Environment Files Created

**`.env.local`** (for local development)
```
VITE_API_BASE=http://localhost:5001
```

**`.env.production`** (for Azure deployment)
```
VITE_API_BASE=https://YOUR_AZURE_APP_NAME.azurewebsites.net
```

## Steps to Deploy to Azure

### Step 1: Update Environment Variable
✅ **Already configured!** Your Azure backend URL is set in `.env.production`:
```
VITE_API_BASE=https://backendmedisync-cua0dmdgh3aacrb0.eastasia-01.azurewebsites.net
```

### Step 2: Build for Production
```bash
cd Frontend/medisync
npm install
npm run build
```

### Step 3: Deploy Frontend to Azure
The `dist/` folder contains your production build. Deploy it to:
- Azure Static Web Apps, OR
- Azure App Service, OR
- Azure Blob Storage + CDN

### Step 4: Ensure CORS is Configured on Backend
Your backend already has CORS configured in `Program.cs`.

For production, update `Backend/Program.cs` to restrict CORS to your frontend URL:
```csharp
policy.WithOrigins("https://delightful-dune-078dd8700.1.azurestaticapps.net")
```

**URLs:**
- Backend: `https://backendmedisync-cua0dmdgh3aacrb0.eastasia-01.azurewebsites.net`
- Frontend: `https://delightful-dune-078dd8700.1.azurestaticapps.net`

## Local Development Testing

To test locally:
```bash
cd Frontend/medisync
npm run dev
```

This will run on `http://localhost:5173` and proxy API calls to `http://localhost:5001`.

## Environment Variables Summary

| Environment | API_BASE | Usage |
|-------------|----------|-------|
| Local Dev | http://localhost:5001 | `npm run dev` |
| Production | https://backendmedisync-cua0dmdgh3aacrb0.eastasia-01.azurewebsites.net | `npm run build` |

## Backend Azure Configuration (Already Set)

Your backend is already configured for Azure:
- ✅ Port binding: Uses Azure's PORT environment variable or defaults to 5001
- ✅ Database: Connected to Azure SQL Database
- ✅ CORS: Enabled for all origins (should be restricted for production)

## Troubleshooting

### API calls still hitting localhost?
1. Verify `.env.production` has correct Azure URL ✅ Done
2. Rebuild: `npm run build`
3. Check that production build is deployed to Azure, not development build

### CORS errors on Azure?
1. Update backend CORS policy in `Backend/Program.cs` to include your frontend URL:
   ```csharp
   policy.WithOrigins("https://delightful-dune-078dd8700.1.azurestaticapps.net")
   ```
2. Restart backend on Azure after changes

### Mixed content error (http → https)?
- ✅ Both URLs use HTTPS, so you're good!
- Frontend: `https://delightful-dune-078dd8700.1.azurestaticapps.net`
- Backend: `https://backendmedisync-cua0dmdgh3aacrb0.eastasia-01.azurewebsites.net`
