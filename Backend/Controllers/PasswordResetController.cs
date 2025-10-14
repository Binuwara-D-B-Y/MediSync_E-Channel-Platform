using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PasswordResetController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly string _frontendBase;

        public PasswordResetController(AppDbContext db)
        {
            _db = db;
            // Frontend base for printed reset link - can be overridden with env var FRONTEND_BASE
            _frontendBase = Environment.GetEnvironmentVariable("FRONTEND_BASE") ?? "http://localhost:5173";
        }

        public class ForgotRequest
        {
            public string? Email { get; set; }
        }

        public class ResetRequest
        {
            public string? Token { get; set; }
            public string? NewPassword { get; set; }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotRequest req)
        {
            if (string.IsNullOrWhiteSpace(req?.Email))
                return BadRequest(new { message = "Email is required" });

            var email = req.Email!.Trim().ToLowerInvariant();
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Email.ToLower() == email);
            if (user == null)
            {
                // Don't reveal existence of accounts - still return 200
                Console.WriteLine($"Password reset requested for non-existing email: {email}");
                return Ok(new { message = "If that email exists we sent a reset link." });
            }

            // Generate a secure random token (URL-safe)
            var tokenBytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(tokenBytes);
            }
            var token = Convert.ToBase64String(tokenBytes)
                .Replace("+", "-")
                .Replace("/", "_")
                .TrimEnd('=');

            user.PasswordResetToken = token;
            user.PasswordResetTokenExpiresUtc = DateTime.UtcNow.AddMinutes(15);
            await _db.SaveChangesAsync();

            var resetUrl = $"{_frontendBase}/reset-password?token={Uri.EscapeDataString(token)}";
            Console.WriteLine($"Password reset link for {user.Email}: {resetUrl}");

            return Ok(new { message = "If that email exists we sent a reset link.", resetUrl });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetRequest req)
        {
            if (string.IsNullOrWhiteSpace(req?.Token) || string.IsNullOrWhiteSpace(req?.NewPassword))
                return BadRequest(new { message = "Token and new password are required" });

            var token = req.Token!.Trim();
            var user = await _db.Users.SingleOrDefaultAsync(u => u.PasswordResetToken == token);
            if (user == null)
                return BadRequest(new { message = "Invalid token" });

            if (!user.PasswordResetTokenExpiresUtc.HasValue || user.PasswordResetTokenExpiresUtc.Value < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Token has expired" });
            }

            // Optional: validate password strength
            if (req.NewPassword!.Length < 8)
                return BadRequest(new { message = "Password must be at least 8 characters long" });

            // Hash password with BCrypt
            var hashed = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
            user.PasswordHash = hashed;

            // Clear token fields
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpiresUtc = null;

            await _db.SaveChangesAsync();

            return Ok(new { message = "Password has been reset successfully" });
        }
    }
}
