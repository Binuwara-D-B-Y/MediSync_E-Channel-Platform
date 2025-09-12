# MediSync Deployment Guide

## 🚀 CI/CD Pipeline Setup

### Prerequisites
- GitHub repository with admin access
- Cloud provider account (Azure/AWS/Netlify)
- Docker Hub account (optional)

### 1. GitHub Secrets Configuration

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

#### For Backend Deployment (Azure)
```
AZURE_WEBAPP_PUBLISH_PROFILE=<your_azure_publish_profile>
```

#### For Frontend Deployment (Netlify)
```
NETLIFY_AUTH_TOKEN=<your_netlify_token>
NETLIFY_SITE_ID=<your_netlify_site_id>
```

#### For Docker Deployment
```
DOCKER_USERNAME=<your_docker_username>
DOCKER_PASSWORD=<your_docker_password>
```

#### For Database
```
DB_SERVER=<production_db_server>
DB_NAME=Medisync_Echannel01
DB_USER=<production_db_user>
DB_PASSWORD=<production_db_password>
```

### 2. Deployment Options

#### Option A: Azure + Netlify (Recommended)
- **Backend**: Azure App Service
- **Frontend**: Netlify
- **Database**: Azure Database for MySQL

#### Option B: Docker + Cloud Provider
- **Backend**: Docker container on Azure Container Instances/AWS ECS
- **Frontend**: Netlify/Vercel
- **Database**: Cloud MySQL service

#### Option C: Full Docker Compose
- **All services**: Docker containers on VPS/Cloud VM

### 3. Local Testing with Docker

```bash
# Build and run all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5094
# Database: localhost:3306
```

### 4. Manual Deployment Steps

#### Backend to Azure App Service
1. Create Azure App Service (ASP.NET Core 8.0)
2. Configure connection strings in Azure portal
3. Download publish profile
4. Add publish profile to GitHub secrets
5. Push to main branch to trigger deployment

#### Frontend to Netlify
1. Create Netlify account
2. Get auth token from Netlify dashboard
3. Create new site and get site ID
4. Add secrets to GitHub
5. Push to main branch to trigger deployment

### 5. Database Setup

#### Production Database
1. Create MySQL database instance
2. Run migrations: `dotnet ef database update`
3. Seed initial data: `POST /api/doctors/seed`

#### Environment Variables
```bash
# Backend
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=Server=...

# Frontend
VITE_API_BASE_URL=https://your-backend-url.com
```

### 6. Monitoring and Logs

#### Azure Application Insights
- Add Application Insights to backend
- Monitor performance and errors

#### Netlify Analytics
- Monitor frontend performance
- Track deployment status

### 7. Security Considerations

- Use HTTPS in production
- Configure CORS properly
- Secure database connections
- Use environment variables for secrets
- Enable authentication/authorization

### 8. Troubleshooting

#### Common Issues
1. **CORS errors**: Check allowed origins in backend
2. **Database connection**: Verify connection string
3. **Build failures**: Check Node.js/Docker versions
4. **API not found**: Verify backend URL in frontend

#### Logs Access
- Azure: App Service → Monitoring → Log stream
- Netlify: Site dashboard → Functions → Logs
- Docker: `docker-compose logs service-name`

## 📋 Deployment Checklist

- [ ] GitHub secrets configured
- [ ] Database created and migrated
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] API endpoints working
- [ ] CORS configured
- [ ] SSL certificates active
- [ ] Monitoring setup
- [ ] Backup strategy implemented
