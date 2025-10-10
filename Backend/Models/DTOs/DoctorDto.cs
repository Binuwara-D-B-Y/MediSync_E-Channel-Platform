using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs
{
    public class CreateDoctorDto
    {
        [Required, MaxLength(100)]
        public required string FullName { get; set; }

        [Required, MaxLength(100)]
        public required string Specialization { get; set; }

        [Required, MaxLength(15)]
        public required string ContactNumber { get; set; }

        [Required, EmailAddress, MaxLength(100)]
        public required string Email { get; set; }

        [Required, MaxLength(500)]
        public required string Qualifications { get; set; }

        [MaxLength(500)]
        public string? Details { get; set; }

        [MaxLength(100)]
        public string? HospitalName { get; set; }

        [MaxLength(200)]
        public string? Address { get; set; }
    }

    public class UpdateDoctorDto
    {
        [Required]
        public int DoctorId { get; set; }

        [Required, MaxLength(100)]
        public required string FullName { get; set; }

        [Required, MaxLength(100)]
        public required string Specialization { get; set; }

        [Required, MaxLength(15)]
        public required string ContactNumber { get; set; }

        [Required, EmailAddress, MaxLength(100)]
        public required string Email { get; set; }

        [Required, MaxLength(500)]
        public required string Qualifications { get; set; }

        [MaxLength(500)]
        public string? Details { get; set; }

        [MaxLength(100)]
        public string? HospitalName { get; set; }

        [MaxLength(200)]
        public string? Address { get; set; }

        public bool IsActive { get; set; } = true;
    }

    public class DoctorResponseDto
    {
        public int DoctorId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Qualifications { get; set; } = string.Empty;
        public string? Details { get; set; }
        public string? HospitalName { get; set; }
        public string? Address { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
