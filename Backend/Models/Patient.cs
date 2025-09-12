using System;
using System.ComponentModel.DataAnnotations;

namespace ClinicWebApp.Models
{
	public sealed class Patient
	{
		public Guid Id { get; set; } = Guid.NewGuid();

		[Required, MaxLength(200)]
		public string Name { get; set; } = string.Empty;

		[Required, MaxLength(256), EmailAddress]
		public string Email { get; set; } = string.Empty;

		[Required, MaxLength(30)]
		public string Phone { get; set; } = string.Empty;

		[MaxLength(400)]
		public string? Address { get; set; }

		[MaxLength(50)]
		public string? Nic { get; set; }

		[Required]
		public string PasswordHash { get; set; } = string.Empty;

		// Password reset support
		public string? PasswordResetToken { get; set; }
		public DateTime? PasswordResetTokenExpiresUtc { get; set; }

		public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;
		public DateTime? UpdatedUtc { get; set; }
	}
}

