using Microsoft.AspNetCore.Mvc;
using Backend.Models.DTOs;
using ClinicWebApp.Services.Interfaces;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly IAuthService _authService;

        public TestController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> TestRegister()
        {
            try
            {
                var testUser = new RegisterDto
                {
                    Name = "Test User",
                    Email = "test@example.com",
                    Phone = "0771234567",
                    Nic = "123456789V",
                    Password = "password123"
                };

                var patient = await _authService.RegisterAsync(testUser);
                return Ok(new { success = true, message = "User registered successfully", userId = patient.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> TestLogin()
        {
            try
            {
                var loginDto = new LoginDto
                {
                    Email = "test@example.com",
                    Password = "password123"
                };

                var result = await _authService.LoginAsync(loginDto);
                return Ok(new { success = true, token = result.Token, expires = result.ExpiresAtUtc });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}