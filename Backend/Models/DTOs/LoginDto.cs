// using System.ComponentModel.DataAnnotations;

// namespace ClinicWebApp.Models.DTOs
// {
// 	public sealed class LoginDto
// 	{
// 		[Required, MaxLength(256), EmailAddress]
// 		public string Email { get; init; } = string.Empty;

// 		[Required, MinLength(6), MaxLength(100)]
// 		public string Password { get; init; } = string.Empty;
// 	}

// 	public sealed class ForgotPasswordRequestDto
// 	{
// 		[Required, MaxLength(256), EmailAddress]
// 		public string Email { get; init; } = string.Empty;
// 	}

// 	public sealed class ResetPasswordRequestDto
// 	{
// 		[Required]
// 		public string Token { get; init; } = string.Empty;

// 		[Required, MinLength(6), MaxLength(100)]
// 		public string NewPassword { get; init; } = string.Empty;
// 	}
// }

