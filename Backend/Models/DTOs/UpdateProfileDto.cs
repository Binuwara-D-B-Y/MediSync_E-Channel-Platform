using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs
{
	public sealed class UpdateProfileDto
	{
		[MaxLength(13)]
		public string? ContactNumber { get; init; }

		[MaxLength(12)]
		public string? NIC { get; init; }

		[MinLength(6), MaxLength(100)]
		public string? NewPassword { get; init; }
	}
}

