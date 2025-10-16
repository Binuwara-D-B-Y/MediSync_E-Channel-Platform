
using Backend.Data;
using Backend.Repositories;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IO;
using System.Text;
using System.Net;
using System.Net.Sockets;

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
Console.WriteLine($"DB_PASSWORD: {dbPassword}");
Console.WriteLine($"ConnectionString: {connectionString}");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// Add HttpClient
builder.Services.AddHttpClient();

// Add JWT Authentication
var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") ?? "dev_secret_change_me";
var secretBytes = Encoding.UTF8.GetBytes(jwtSecret);
if (secretBytes.Length < 32)
{
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

// Register repositories
builder.Services.AddScoped<DoctorRepository>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<IDoctorScheduleRepository, DoctorScheduleRepository>();

// Register services
builder.Services.AddScoped<DoctorService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IBookingService, BookingService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Bind to Azure's PORT environment variable or default to 5000 for local development.
// If the preferred port is unavailable (in use), automatically try fallback port 5001.
var envPort = Environment.GetEnvironmentVariable("PORT");
int preferredPort = int.TryParse(envPort, out var parsed) ? parsed : 5000;
int fallbackPort = 5001;
int selectedPort = preferredPort;

static bool IsPortAvailable(int portToCheck)
{
    // Try binding to IPv4 Any and IPv6 Any to mimic Kestrel's AnyIP binding.
    // If either bind succeeds then the port is available for binding by Kestrel.
    TcpListener? v4 = null;
    TcpListener? v6 = null;
    try
    {
        v4 = new TcpListener(IPAddress.Any, portToCheck);
        v4.Start();
        v4.Stop();

        // Try IPv6 as well
        v6 = new TcpListener(IPAddress.IPv6Any, portToCheck);
        v6.Server.DualMode = true; // allow dual-mode if supported
        v6.Start();
        v6.Stop();

        return true;
    }
    catch
    {
        return false;
    }
    finally
    {
        try { v4?.Stop(); } catch { }
        try { v6?.Stop(); } catch { }
    }
}

if (args.Length == 0)
{
    if (!IsPortAvailable(preferredPort))
    {
        Console.WriteLine($"Port {preferredPort} is unavailable. Trying fallback port {fallbackPort}...");
        if (IsPortAvailable(fallbackPort))
        {
            selectedPort = fallbackPort;
        }
        else
        {
            Console.WriteLine($"Neither port {preferredPort} nor {fallbackPort} are available. Kestrel will attempt to bind to {preferredPort} which may fail.");
            selectedPort = preferredPort;
        }
    }

    builder.WebHost.UseUrls($"http://*:{selectedPort}");
}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

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

Console.WriteLine($"App running on port {selectedPort}");
app.Run();
