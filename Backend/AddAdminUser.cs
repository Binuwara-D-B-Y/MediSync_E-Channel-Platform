using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace Backend
{
    public class AddAdminUser
    {
        public static async Task Main(string[] args)
        {
            // Load environment variables
            DotNetEnv.Env.Load();
            
            var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");
            var connectionString = $"Server=tcp:medisyncadmin.database.windows.net,1433;Initial Catalog=MediSyncDb;Persist Security Info=False;User ID=medisyncadmin;Password={dbPassword};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";
            
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlServer(connectionString)
                .Options;

            using var context = new AppDbContext(options);
            
            // Check if admin already exists
            var existingAdmin = await context.Users.FirstOrDefaultAsync(u => u.Email == "admin@medisync.com");
            if (existingAdmin != null)
            {
                Console.WriteLine("Admin user already exists!");
                return;
            }

            // Create admin user
            var adminUser = new User
            {
                FullName = "System Administrator",
                Email = "admin@medisync.com",
                PasswordHash = HashPassword("admin123"),
                NIC = "200012345678",
                Role = UserRole.Admin,
                ContactNumber = "0771234567"
            };

            context.Users.Add(adminUser);
            await context.SaveChangesAsync();
            
            Console.WriteLine("✅ Admin user created successfully!");
            Console.WriteLine("Email: admin@medisync.com");
            Console.WriteLine("Password: admin123");
        }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }
}