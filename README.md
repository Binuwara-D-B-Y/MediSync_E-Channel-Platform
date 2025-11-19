# Hospital E-Channeling & Payment Management System

A web application for hospital appointment booking and management. Patients can register, search doctors, book appointments, and manage favorites. Administrators can manage doctors, schedules, and view dashboard analytics.

## Features

### Patient Features
- User registration and authentication (local + Clerk integration)
- Doctor search and filtering by specialization
- Appointment booking with time slot selection
- Favorite doctors management
- User profile management with image upload
- Password reset functionality
- Appointment history viewing

### Administrator Features
- Dashboard with system statistics
- Doctor management (add, edit, view)
- Schedule management for doctors
- Transaction monitoring
- Patient and appointment analytics

### System Features
- JWT-based authentication
- Payment simulation system
- Email notifications
- Comprehensive testing suite
- Load testing capabilities

## Technology Stack
- **Frontend:** React.js with Vite
- **Backend:** ASP.NET Core Web API (.NET 8.0)
- **Database:** SQL Server / Azure SQL Database
- **Authentication:** JWT + Clerk integration
- **Deployment:** Azure App Services
- **Testing:** Selenium E2E, JMeter Load Testing, Unit/Integration Tests

## Project Structure
- `/Frontend/medisync` – React.js application with Vite
- `/Backend` – ASP.NET Core Web API
- `/SeleniumTests` – E2E automated testing
- `/JMeter` – Load testing scripts
- `/Tests` – Unit and integration tests
- `/Reports` – Documentation and test reports

## API Endpoints
- **Authentication:** `/api/auth/login`, `/api/auth/register`
- **Doctors:** `/api/doctors`, `/api/doctors/{id}`
- **Appointments:** `/api/booking`, `/api/booking/user`
- **Favorites:** `/api/favorites`
- **Admin:** `/api/admin/dashboard/stats`

## Default URLs
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5001
- **Swagger UI:** http://localhost:5001/swagger

## Deployed links
- **Frontend:** https://delightful-dune-078dd8700.1.azurestaticapps.net/
- **Backend:** https://backendmedisync-cua0dmdgh3aacrb0.eastasia-01.azurewebsites.net/

## BRANCHING STRATEGIES
main
    The stable, production-ready branch.  Contains clean, tested, and released code only.
    Acts as the reference for production-quality code.
development
    Currently the deployed branch.  All completed features are merged here before deployment.
    Serves as the active branch reflecting the live environment
Feature Branches
    Naming convention: feature/<feature-name> <developer-initials>


## Installation & Setup

### Prerequisites
- .NET 8.0 SDK
- Node.js (v18+)
- SQL Server or Azure SQL Database
- Chrome browser (for testing)


### Backend Setup
1. Navigate to Backend folder:
   ```bash
   cd Backend
   ```

2. Create `.env` file with database password:
   ```
   DB_PASSWORD=your_database_password
   JWT_SECRET=your_jwt_secret
   ```

3. Update database:
   ```bash
   dotnet ef database update
   ```

4. Run the API:
   ```bash
   dotnet run
   ```

### Frontend Setup
1. Navigate to Frontend folder: cd Frontend/medisync
2. Install dependencies:  npm install
3. Start development server: npm run dev

### Testing

#### E2E Tests (Selenium) -- cd SeleniumTests, dotnet test

#### Load Testing (JMeter)
```bash
cd JMeter
jmeter -n -t MediSync-LoadTest.jmx -l results.jtl
```

#### Unit Tests
```bash
cd Tests
dotnet test
```

## Test Credentials
- **Email:** niki123@gmail.com
- **Password:** niki123

### Backend Development
```bash
# Clean and build
dotnet clean
dotnet build

# Run with hot reload
dotnet run

# Run tests
dotnet test
```

### Frontend Development
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Team Members
D B Y Binuwara
A M N D Bandara
Mahima Linash
Chamika Pathirana
