using System;

namespace ClinicWebApp.Models.DTOs
{
	public sealed class AuthResponseDto
	{
		public string Token { get; init; } = string.Empty;
		public DateTime ExpiresAtUtc { get; init; }
	}
}

