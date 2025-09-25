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

