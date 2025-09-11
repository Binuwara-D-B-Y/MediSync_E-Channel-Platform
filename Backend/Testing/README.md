This folder contains unit and UI tests for the Backend and Frontend components.

Prerequisites:
- .NET 8 SDK installed
- Google Chrome installed (for Selenium UI tests)
- The frontend dev server running (Vite default: http://localhost:5173) for UI tests

How to run unit tests:
1. Open a terminal in `Backend/Testing` and run:

   dotnet test

UI tests (Selenium):
- Ensure the frontend dev server is running (`cd Frontend/medisync; npm run dev`) before running UI tests.
- UI tests use ChromeDriver packaged by the NuGet package. If Chrome/driver mismatch occurs, update `Selenium.WebDriver.ChromeDriver` version accordingly.

Notes:
- Controller tests use EF Core InMemory provider and do not require a database.
- Adjust the `_baseUrl` in `UITests.cs` if your frontend runs on a different host/port.
