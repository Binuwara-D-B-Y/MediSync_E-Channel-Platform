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

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// HttpClient factory needed to fetch JWKS or call Clerk APIs
builder.Services.AddHttpClient();
// AuthService handles Clerk token verification and user mapping
builder.Services.AddScoped<Backend.Services.AuthService>();
// CORS - allow frontend dev origin(s). During development this is permissive; tighten for production.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowDev", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

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
// Enable CORS for development front-end
app.UseCors("AllowDev");
app.UseAuthorization();
app.MapControllers();

// Auto-create/update database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // Try to ensure database is created for local/dev run. If you use migrations, switch to Migrate().
    try
    {
        db.Database.EnsureCreated();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Warning: EnsureCreated failed: {ex.Message}");
    }

    // If we've added a new property to User (ClerkUserId) but the DB schema hasn't been updated,
    // try to add the column safely to avoid runtime DbUpdateException. This is a one-time, safe ALTER.
    try
    {
        var conn = db.Database.GetDbConnection();
        await conn.OpenAsync();
        using (var cmd = conn.CreateCommand())
        {
            cmd.CommandText = @"SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='Users' AND COLUMN_NAME='ClerkUserId'";
            var existsObj = await cmd.ExecuteScalarAsync();
            var exists = false;
            if (existsObj != null && int.TryParse(existsObj.ToString(), out var cnt)) exists = cnt > 0;
            if (!exists)
            {
                Console.WriteLine("Adding missing column 'ClerkUserId' to Users table...");
                using var addCmd = conn.CreateCommand();
                addCmd.CommandText = "ALTER TABLE [Users] ADD [ClerkUserId] NVARCHAR(200) NULL;";
                await addCmd.ExecuteNonQueryAsync();
                Console.WriteLine("Column added.");
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Warning: automatic schema adjustment failed: {ex.Message}");
    }
}

Console.WriteLine($"App running on port {port}");
app.Run();
