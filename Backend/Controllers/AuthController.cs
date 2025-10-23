<<<<<<< HEAD
using Backend.Models.DTOs;
using ClinicWebApp.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ClinicWebApp.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public sealed class AuthController : ControllerBase
	{
		private readonly IAuthService _authService;

		public AuthController(IAuthService authService)
		{
			_authService = authService;
		}

		[HttpPost("register")]
		public async Task<ActionResult<ApiResponseDto<PatientDto>>> Register([FromBody] RegisterDto dto)
		{
			if (!ModelState.IsValid)
				return BadRequest(ApiResponseDto<PatientDto>.Fail("Invalid data."));

			try
			{
				var patient = await _authService.RegisterAsync(dto);
				return Ok(ApiResponseDto<PatientDto>.Ok(PatientDto.FromEntity(patient), "Registration successful."));
			}
			catch (InvalidOperationException ex)
			{
				return BadRequest(ApiResponseDto<PatientDto>.Fail(ex.Message));
			}
		}

		[HttpPost("login")]
		public async Task<ActionResult<ApiResponseDto<AuthResponseDto>>> Login([FromBody] LoginDto dto)
		{
			if (!ModelState.IsValid)
				return Unauthorized(ApiResponseDto<AuthResponseDto>.Fail("Invalid credentials."));

			try
			{
				var token = await _authService.LoginAsync(dto);
				return Ok(ApiResponseDto<AuthResponseDto>.Ok(token, "Login successful."));
			}
			catch (UnauthorizedAccessException)
			{
				return Unauthorized(ApiResponseDto<AuthResponseDto>.Fail("Invalid credentials."));
			}
		}

		[HttpPost("forgot")]
		public async Task<ActionResult<ApiResponseDto<string>>> Forgot([FromBody] ForgotPasswordRequestDto dto)
		{
			if (!ModelState.IsValid)
				return Ok(ApiResponseDto<string>.Ok("If the email exists, a reset link has been sent."));
			var msgOrToken = await _authService.RequestPasswordResetAsync(dto);
			return Ok(ApiResponseDto<string>.Ok(msgOrToken, "Password reset requested."));
		}

		[HttpPost("reset")]
		public async Task<ActionResult<ApiResponseDto<string>>> Reset([FromBody] ResetPasswordRequestDto dto)
		{
			if (!ModelState.IsValid)
				return BadRequest(ApiResponseDto<string>.Fail("Invalid request."));
			try
			{
				await _authService.ResetPasswordAsync(dto);
				return Ok(ApiResponseDto<string>.Ok("Password reset successful."));
			}
			catch (InvalidOperationException ex)
			{
				return BadRequest(ApiResponseDto<string>.Fail(ex.Message));
			}
		}
	}
}

=======
using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Models.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        // POST: /api/Auth/register
        // Expects Authorization: Bearer <Clerk token>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Backend.Models.DTOs.RegisterDto? dto)
        {
            // If Clerk is configured, require Authorization header
            if (_authService.IsClerkConfigured)
            {
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Bearer "))
                    return BadRequest(new { message = "Missing Authorization Bearer token." });

                var token = authHeader.Substring("Bearer ".Length).Trim();
                var principal = await _authService.VerifyTokenAsync(token);
                if (principal == null)
                    return Unauthorized(new { message = "Invalid clerk token." });

                // Extract common claims
                var sub = principal.FindFirst("sub")?.Value ?? principal.FindFirst("user_id")?.Value;
                var email = principal.FindFirst("email")?.Value ?? principal.FindFirst("preferred_username")?.Value;
                var name = principal.FindFirst("name")?.Value ?? principal.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;

                if (string.IsNullOrWhiteSpace(sub) || string.IsNullOrWhiteSpace(email))
                    return BadRequest(new { message = "Token missing required claims (sub,email)." });

                var user = await _authService.EnsureLocalUserAsync(sub, email, name ?? string.Empty);
                return Ok(new { data = new { token }, token, message = "Authenticated via Clerk" });
            }

            // Fallback: local register using JSON body
            if (dto == null)
                return BadRequest(new { message = "Missing registration data." });

            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Validation failed", errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
            }

            try
            {
                var user = await _authService.RegisterLocalAsync(dto.FullName, dto.Email, dto.NIC, dto.Password, dto.ContactNumber);
                return Ok(new { message = "Registration successful", data = new { userId = user.UserId } });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message, detail = ex.InnerException?.Message });
            }
        }

        // POST: /api/Auth/login
        // Verifies Clerk token and returns local mapping
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Backend.Models.DTOs.LoginDto? dto)
        {
            // Clerk flow
            if (_authService.IsClerkConfigured)
            {
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Bearer "))
                    return BadRequest(new { message = "Missing Authorization Bearer token." });

                var token = authHeader.Substring("Bearer ".Length).Trim();
                var principal = await _authService.VerifyTokenAsync(token);
                if (principal == null)
                    return Unauthorized(new { message = "Invalid clerk token." });

                var sub = principal.FindFirst("sub")?.Value ?? principal.FindFirst("user_id")?.Value;
                var email = principal.FindFirst("email")?.Value ?? principal.FindFirst("preferred_username")?.Value;
                var name = principal.FindFirst("name")?.Value ?? principal.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;

                if (string.IsNullOrWhiteSpace(sub) || string.IsNullOrWhiteSpace(email))
                    return BadRequest(new { message = "Token missing required claims (sub,email)." });

                var user = await _authService.EnsureLocalUserAsync(sub, email, name ?? string.Empty);

                return Ok(new { data = new { token }, token, message = "Logged in via Clerk" });
            }

            // Local login fallback using JSON email/password
            if (dto == null)
                return BadRequest(new { message = "Missing login data." });

            var userLocal = await _authService.LoginLocalAsync(dto.Email, dto.Password);
            if (userLocal == null)
                return Unauthorized(new { message = "Invalid email or password." });

            var jwt = _authService.GenerateJwt(userLocal);
            return Ok(new { data = new { token = jwt }, token = jwt, message = "Logged in (local)" });
        }
    }
}
>>>>>>> wishlist
