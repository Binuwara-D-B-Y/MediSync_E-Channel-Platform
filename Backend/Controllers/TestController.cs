using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly AuthService _authService;

        public TestController(AppDbContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        // POST: api/test/create-admin
        [HttpPost("create-admin")]
        public async Task<IActionResult> CreateTestAdmin()
        {
            try
            {
                // Check if admin already exists
                var existingAdmin = await _context.Users.FirstOrDefaultAsync(u => u.Role == UserRole.Admin);
                if (existingAdmin != null)
                {
                    return Ok(new { message = "Admin user already exists", email = existingAdmin.Email });
                }

                // Create test admin user
                var adminUser = new User
                {
                    FullName = "Test Admin",
                    Email = "admin@medisync.com",
                    NIC = "123456789V",
                    PasswordHash = _authService.HashPassword("admin123"),
                    Role = UserRole.Admin,
                    ContactNumber = "0771234567"
                };

                _context.Users.Add(adminUser);
                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Test admin user created successfully",
                    email = "admin@medisync.com",
                    password = "admin123",
                    role = "Admin"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error creating admin user", error = ex.Message });
            }
        }

        // GET: api/test/users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new { u.UserId, u.FullName, u.Email, u.Role })
                .ToListAsync();
            
            return Ok(users);
        }
    }
}