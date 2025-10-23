<<<<<<< HEAD

using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs
{
	public sealed class RegisterDto
	{
		[Required, MaxLength(200)]
		public string Name { get; init; } = string.Empty;

		[Required, MaxLength(256), EmailAddress]
		public string Email { get; init; } = string.Empty;

		[Required, MaxLength(30)]
		public string Phone { get; init; } = string.Empty;

		[Required, MaxLength(50)]
		public string Nic { get; init; } = string.Empty;
=======
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.Models.DTOs
{
	public sealed class RegisterDto
	{
		[Required, MaxLength(100)]
		[JsonPropertyName("name")]
		public string FullName { get; init; } = string.Empty;

		[Required, MaxLength(100), EmailAddress]
		public string Email { get; init; } = string.Empty;

		[MaxLength(13)]
		[JsonPropertyName("phone")]
		public string? ContactNumber { get; init; }

		[Required, MaxLength(12)]
		[JsonPropertyName("nic")]
		public string NIC { get; init; } = string.Empty;

		[Required, MinLength(6), MaxLength(100)]
		public string Password { get; init; } = string.Empty;
	}
}
>>>>>>> wishlist

		[Required, MinLength(6), MaxLength(100)]
		public string Password { get; init; } = string.Empty;
	}
}