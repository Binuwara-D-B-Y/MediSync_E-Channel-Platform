
using Backend.Data;
using Backend.Repositories;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IO;
using System.Text;
using Backend.Models;
using Microsoft.AspNetCore.Identity;


// Load environment variables for database password and JWT secret
DotNetEnv.Env.Load(Path.Combine(Directory.GetCurrentDirectory(), ".env"));

var builder = WebApplication.CreateBuilder(args);

// Set up database connection with password from environment
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
Console.WriteLine($"DB_PASSWORD: {dbPassword}");
Console.WriteLine($"ConnectionString: {connectionString}");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// Password hashing service for user accounts
builder.Services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();


// Add HttpClient
builder.Services.AddHttpClient();

// JWT authentication setup for user login sessions
var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") ?? "dev_secret_change_me";
var secretBytes = Encoding.UTF8.GetBytes(jwtSecret);
if (secretBytes.Length < 32)
{
    // Ensure minimum key length for security
    secretBytes = System.Security.Cryptography.SHA256.HashData(secretBytes);
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(secretBytes),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };
    });

// Register data access repositories
builder.Services.AddScoped<DoctorRepository>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<IDoctorScheduleRepository, DoctorScheduleRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IFavoriteRepository, FavoriteRepository>(); // For managing favorite doctors


// Register business logic services
builder.Services.AddScoped<DoctorService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IUserService, UserService>(); // Handles user account management


// Allow React frontend to call our API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure port for Azure deployment or local development
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://*:{port}");

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // Disabled for development

// Use CORS
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Auto-create/update database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // db.Database.Migrate(); // Creates database if missing, applies pending migrations
}

Console.WriteLine($"App running on port {port}");
app.Run();
