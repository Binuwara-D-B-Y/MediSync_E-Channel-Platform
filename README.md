# Hospital E-Channeling & Payment Management System

A web application that allows patients to register, search and filter doctors, book appointments, make secure payments, and view transaction history. Hospital administrators can register new doctors and assign them to consultation schedules.

## Features

### Patient
- Register, login, and manage profile
- Search and filter doctors by specialization, hospital, or availability
- Book, reschedule, and cancel appointments
- Make secure payments
- View past transactions
- Download payment receipts (PDF)

### Hospital Consultant / Administrator
- Register new doctors
- Manage doctor profiles
- Assign doctors to consultation schedules

## Technology Stack
- **Frontend:** React.js
- **Backend:** ASP.NET Web API
- **Database:** ASURE SQL
- **Deployment:** Azure App Services
- **Testing:** Selenium, JMeter, Unit Tests

## Project Structure
- `/frontend` – React.js application
- `/backend` – ASP.NET Web API
- `/database` – Azure SQL
- `/docs` – Documentation and test cases

## Deployment
Deployment is automated via GitHub Actions on pushes to the development branch.
Frontend (Azure Static Web Apps)

URL: https://delightful-dune-078dd8700.1.azurestaticapps.net
Workflow: .github/workflows/azure-static-web-apps-delightful-dune-078dd8700.yml
Environment Variable: VITE_API_BASE_URL (set to backend URL)

Backend (Azure App Service)

URL: https://backendmedisync-cua0dmdgh3aacrb0.eastasia-01.azurewebsites.net
Workflow: .github/workflows/development_backendmedisync.yml
Environment Variable: DB_PASSWORD (for database connection)

GitHub Secrets Required:

AZURE_STATIC_WEB_APPS_API_TOKEN_DELIGHTFUL_DUNE_078DD8700 (from Azure Static Web Apps deployment token)
AZURE_WEBAPP_PUBLISH_PROFILE (from Azure App Service publish profile)

To deploy:

Push changes to development branch.
Monitor GitHub Actions for build/deploy status.
   

## Team Members
D B Y Binuwara
A M N D Bandara
Mahima Linash
Chamika Pathirana

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hospital-echanneling.git

   
Installation and Local Setup

## Clone the Repository:
textgit clone https://github.com/[yourusername]/MediSync_E-Channel-Platform.git
cd MediSync_E-Channel-Platform

## Set Up the Backend:

Navigate to the backend directory:
textcd Backend

Restore dependencies:
textdotnet restore

Configure the database connection in appsettings.json or appsettings.Development.json (use your Azure SQL connection string, e.g., "ConnectionStrings": { "DefaultConnection": "Server=tcp:yourserver.database.windows.net,1433;Initial Catalog=yourdb;User ID=youruser;Password=yourpassword;" }).
Apply database migrations:
textdotnet ef migrations add InitialCreate  # If needed for new changes
dotnet ef database update

Build and run:
textdotnet build
dotnet run
The backend will run at http://localhost:5000 (or configured port). Test with / (root) or /test endpoints.


## Set Up the Frontend:

Navigate to the frontend directory:
textcd ../Frontend/medisync

Install dependencies:
textnpm install

Create a .env file for local development (e.g., VITE_API_BASE_URL=http://localhost:5000 to point to your local backend).
Run the development server:
textnpm run dev
The frontend will run at http://localhost:5173. Open in your browser to test.


## Database Seeding:

Use scripts in /database to seed sample data into Azure SQL.
Run via Azure Data Studio or SQL Server Management Studio.


## Testing Locally:

Frontend: npm test
Backend: dotnet test
End-to-End: Refer to /docs for Selenium/JMeter scripts.
