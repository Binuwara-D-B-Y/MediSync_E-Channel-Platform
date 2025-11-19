# Deployment Instructions

## Frontend (Azure Static Web App)
1. Go to Azure Portal
2. Select: delightful-dune-078dd8700
3. Upload contents of `Frontend/medisync/dist/` folder

OR use Azure CLI:
```bash
az staticwebapp upload --source Frontend/medisync/dist --name delightful-dune-078dd8700
```

## Backend (Azure Web App)
```bash
cd Backend
dotnet publish -c Release
# Deploy to: backendmedisync-cua0dmdgh3aacrb0
```

## Verify
- Frontend: https://delightful-dune-078dd8700.1.azurestaticapps.net
- Backend: https://backendmedisync-cua0dmdgh3aacrb0.eastasia-01.azurewebsites.net/api/doctors

## Configuration Summary
- Frontend API Base: https://backendmedisync-cua0dmdgh3aacrb0.eastasia-01.azurewebsites.net
- Backend CORS: Allows https://delightful-dune-078dd8700.1.azurestaticapps.net
- Local Dev: Works on http://localhost:5173 (proxies to http://localhost:5001)
