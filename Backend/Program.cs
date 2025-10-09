// using Backend.Data;
// using Microsoft.EntityFrameworkCore;
// using System.IO;

// // Explicitly load .env from current directory
// DotNetEnv.Env.Load(Path.Combine(Directory.GetCurrentDirectory(), ".env"));

// var builder = WebApplication.CreateBuilder(args);

// // Load DB connection string
// var rawConnectionString = builder.Configuration.GetConnectionString("DefaultConnection");
// if (string.IsNullOrEmpty(rawConnectionString))
//     throw new InvalidOperationException("Database connection string 'DefaultConnection' is missing.");

// var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");
// if (string.IsNullOrWhiteSpace(dbPassword))
// {
//     Console.WriteLine("ERROR: DB_PASSWORD not loaded from .env!");
//     throw new InvalidOperationException("DB_PASSWORD not loaded from .env");
// }
// var connectionString = rawConnectionString.Replace("${DB_PASSWORD}", dbPassword);
// Console.WriteLine($"DB_PASSWORD: {dbPassword}");
// Console.WriteLine($"ConnectionString: {connectionString}");

// builder.Services.AddDbContext<AppDbContext>(options =>
//     options.UseSqlServer(connectionString));  // Replace with your connection string

// builder.Services.AddControllers();
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

// var app = builder.Build();

// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// app.UseHttpsRedirection();
// app.UseAuthorization();
// app.MapControllers();

// // Auto-create/update database
// using (var scope = app.Services.CreateScope())
// {
//     var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
//     db.Database.Migrate(); // Creates database if missing, applies pending migrations
// }

// app.Run();

using Backend.Data;
using Backend.Repositories;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using System.IO;

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

// Register repositories
builder.Services.AddScoped<DoctorRepository>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<IDoctorScheduleRepository, DoctorScheduleRepository>();

// Register services
builder.Services.AddScoped<DoctorService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IBookingService, BookingService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Bind to Azure's PORT environment variable or default to 5000 for local development
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://*:{port}");

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
    // db.Database.Migrate(); // Creates database if missing, applies pending migrations
}

Console.WriteLine($"App running on port {port}");
app.Run();
