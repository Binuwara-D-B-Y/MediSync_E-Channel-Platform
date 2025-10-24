using Microsoft.AspNetCore.Mvc;
using Backend.Models.DTOs;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/mock/[controller]")]
    public class MockAuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public MockAuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public IActionResult MockLogin([FromBody] LoginDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Missing login data." });

            // Mock users for testing
            var mockUsers = new[]
            {
                new { Email = "admin@medisync.com", Password = "admin123", Role = "Admin", UserId = 1, FullName = "Test Admin" },
                new { Email = "patient@medisync.com", Password = "patient123", Role = "Patient", UserId = 2, FullName = "Test Patient" }
            };

            var user = mockUsers.FirstOrDefault(u => u.Email == dto.Email && u.Password == dto.Password);
            
            if (user == null)
                return Unauthorized(new { message = "Invalid email or password." });

            // Create mock user object for JWT generation
            var mockUser = new Backend.Models.User
            {
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                NIC = "123456789V",
                PasswordHash = "mock",
                Role = user.Role == "Admin" ? Backend.Models.UserRole.Admin : Backend.Models.UserRole.Patient
            };

            var jwt = _authService.GenerateJwt(mockUser);
            
            return Ok(new { 
                data = new { 
                    token = jwt, 
                    role = user.Role 
                }, 
                token = jwt, 
                message = "Logged in (mock)" 
            });
        }

        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok(new { message = "Mock auth controller is working", timestamp = DateTime.UtcNow });
        }
    }
}