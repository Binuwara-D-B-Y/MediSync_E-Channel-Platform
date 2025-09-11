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

// Test-only override: when the env var USE_INMEMORY_FOR_TESTS is set to "true",
// register an InMemory provider instead of MySQL. This keeps production behavior
// unchanged while allowing integration tests to run without a live MySQL.
// Determine if tests requested an in-memory DB. Allow multiple signals:
// - process env var USE_INMEMORY_FOR_TESTS
// - configuration key USE_INMEMORY_FOR_TESTS (allows WithWebHostBuilder to set it)
// - hosting environment named "Testing"
var useInMemoryForTestsEnv = Environment.GetEnvironmentVariable("USE_INMEMORY_FOR_TESTS");
var useInMemoryForTestsConfig = builder.Configuration["USE_INMEMORY_FOR_TESTS"];
var isTestingEnv = builder.Environment.IsEnvironment("Testing");
if (string.Equals(useInMemoryForTestsEnv, "true", StringComparison.OrdinalIgnoreCase)
    || string.Equals(useInMemoryForTestsConfig, "true", StringComparison.OrdinalIgnoreCase)
    || isTestingEnv)
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseInMemoryDatabase("TestDb"));
}
else
{
    var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");
    if (string.IsNullOrWhiteSpace(dbPassword))
    {
        Console.WriteLine("DB_PASSWORD missing; falling back to InMemory database for safety.");
        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseInMemoryDatabase("FallbackDb"));
    }
    else
    {
        var connectionString = rawConnectionString.Replace("${DB_PASSWORD}", dbPassword);
        Console.WriteLine($"ConnectionString: {connectionString}");

        // Avoid network calls during host startup (AutoDetect attempts to open a DB connection).
        // Use a reasonable static server version instead of AutoDetect so tests don't require DB access.
        var fallback = ServerVersion.Parse("8.0.32-mysql");
        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseMySql(connectionString, fallback));
    }
}

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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
    // Only run migrations when using a relational provider (InMemory does not support migrations)
    if (db.Database.IsRelational())
    {
        db.Database.Migrate(); // Creates database if missing, applies pending migrations
    }
}

app.Run();

// Expose the Program class for integration tests (WebApplicationFactory requires a public type)
public partial class Program { }
