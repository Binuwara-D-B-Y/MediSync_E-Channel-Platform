@echo off
echo Running Hospital E-Channeling Unit Tests...
echo.

cd Backend\backend.test

echo Restoring packages...
dotnet restore

echo Building test project...
dotnet build

echo Running tests...
dotnet test --verbosity normal

echo.
echo Test run completed!
pause