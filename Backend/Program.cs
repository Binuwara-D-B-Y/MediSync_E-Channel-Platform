using Backend.Data;
using Microsoft.EntityFrameworkCore;
using System.IO;
using Backend.Services;
using Backend.Repositories;

// Explicitly load .env from current directory
DotNetEnv.Env.Load(Path.Combine(Directory.GetCurrentDirectory(), ".env"));

var builder = WebApplication.CreateBuilder(args);

// Load DB connection string
var rawConnectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(rawConnectionString))
    throw new InvalidOperationException("Database connection string 'DefaultConnection' is missing.");

var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");
if (string.IsNullOrWhiteSpace(dbPassword))
{
    Console.WriteLine("ERROR: DB_PASSWORD not loaded from .env!");
    throw new InvalidOperationException("DB_PASSWORD not loaded from .env");
}
var connectionString = rawConnectionString.Replace("${DB_PASSWORD}", dbPassword);
// Avoid printing sensitive credentials
if (builder.Environment.IsDevelopment())
{
    Console.WriteLine("Database connection string loaded successfully.");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddDbContext<ClinicWebApp.Data.ClinicDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Dependency Injection: ADO.NET services and repositories
builder.Services.AddSingleton<IDatabaseConnectionService, DatabaseConnectionService>();

// Repositories
builder.Services.AddScoped<ISpecializationRepository, SpecializationRepository>();
builder.Services.AddScoped<IDoctorRepository, DoctorRepositoryImpl>();
builder.Services.AddScoped<IDoctorScheduleRepository, DoctorScheduleRepository>();
builder.Services.AddScoped<ClinicWebApp.Repositories.IPatientRepository, ClinicWebApp.Repositories.PatientRepository>();

// Services
builder.Services.AddScoped<ISpecializationService, SpecializationService>();
builder.Services.AddScoped<IDoctorService, DoctorServiceImpl>();
builder.Services.AddScoped<IDoctorScheduleService, DoctorScheduleService>();
builder.Services.AddScoped<ClinicWebApp.Services.Interfaces.IAuthService, ClinicWebApp.Services.Implementations.AuthService>();
builder.Services.AddScoped<ClinicWebApp.Services.Interfaces.IJwtService, ClinicWebApp.Services.Implementations.JwtService>();
builder.Services.AddScoped<ClinicWebApp.Services.Interfaces.IPatientService, ClinicWebApp.Services.Implementations.PatientService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Auto-create/update database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); // Creates database if missing, applies pending migrations
}

app.Run();
