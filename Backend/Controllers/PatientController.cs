using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Backend.Models.DTOs;
using ClinicWebApp.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicWebApp.Controllers
{
	[ApiController]
	[Authorize]
	[Route("api/[controller]")]
	public sealed class PatientController : ControllerBase
	{
		private readonly IPatientService _patientService;

		public PatientController(IPatientService patientService)
		{
			_patientService = patientService;
		}

		[HttpGet("me")]
		public async Task<ActionResult<ApiResponseDto<PatientDto>>> GetMe()
		{
			if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub), out var userId))
				return NotFound(ApiResponseDto<PatientDto>.Fail("Invalid token."));

			try
			{
				var updated = await _patientService.UpdateProfileAsync(userId, new UpdateProfileDto());
				return Ok(ApiResponseDto<PatientDto>.Ok(updated));
			}
			catch (KeyNotFoundException ex)
			{
				return NotFound(ApiResponseDto<PatientDto>.Fail(ex.Message));
			}
		}

		[HttpPut("me")]
		public async Task<ActionResult<ApiResponseDto<PatientDto>>> UpdateMe([FromBody] UpdateProfileDto dto)
		{
			if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub), out var userId))
				return BadRequest(ApiResponseDto<PatientDto>.Fail("Invalid token."));

			try
			{
				var updated = await _patientService.UpdateProfileAsync(userId, dto);
				return Ok(ApiResponseDto<PatientDto>.Ok(updated, "Profile updated successfully."));
			}
			catch (KeyNotFoundException ex)
			{
				return NotFound(ApiResponseDto<PatientDto>.Fail(ex.Message));
			}
		}

		[HttpDelete("me")]
		public async Task<ActionResult<ApiResponseDto<string>>> DeleteMe([FromBody] DeleteAccountRequestDto dto)
		{
			if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub), out var userId))
				return BadRequest(ApiResponseDto<string>.Fail("Invalid token."));

			try
			{
				await _patientService.DeleteAccountAsync(userId, dto.Confirm);
				return Ok(ApiResponseDto<string>.Ok("Account deleted successfully."));
			}
			catch (InvalidOperationException ex)
			{
				return BadRequest(ApiResponseDto<string>.Fail(ex.Message));
			}
			catch (KeyNotFoundException ex)
			{
				return NotFound(ApiResponseDto<string>.Fail(ex.Message));
			}
		}
	}
}

