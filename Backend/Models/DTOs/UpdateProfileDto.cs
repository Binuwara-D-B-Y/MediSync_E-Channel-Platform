using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs
{
	public sealed class UpdateProfileDto
	{
		[MaxLength(30)]
		public string? Phone { get; init; }

		[MaxLength(400)]
		public string? Address { get; init; }

		[MaxLength(50)]
		public string? Nic { get; init; }

		[MinLength(6), MaxLength(100)]
		public string? NewPassword { get; init; }
	}
}

