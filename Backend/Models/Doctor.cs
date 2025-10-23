using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Doctor
    {
        [Key]
        public int DoctorId { get; set; }

        [Required, MaxLength(100)]
        public required string FullName { get; set; }

        [Required]
        public int SpecializationId { get; set; }

<<<<<<< HEAD
        [MaxLength(50)]
        public string? SpecializationName { get; set; } // For display only

        [Required, MaxLength(15)]
        public required string ContactNumber { get; set; }

        [Required, EmailAddress, MaxLength(100)]
        public required string Email { get; set; }

        [Required, MaxLength(500)]
        public required string Qualifications { get; set; }

        [Required]
        public int ExperienceYears { get; set; }

        [MaxLength(300)]
        public string? Details { get; set; }

        [MaxLength(100)]
        public string? HospitalName { get; set; }

        [MaxLength(200)]
        public string? Address { get; set; }

        public bool IsActive { get; set; } = true;
=======
        [Required, MaxLength(12)]
        [RegularExpression(@"^\d{9}[Vv]|\d{12}$", ErrorMessage = "NIC must be either 9 digits followed by 'V' or 12 digits")]
        public required string NIC { get; set; }

        [MaxLength(200)]
        public string? Qualification { get; set; }

        [Required, MaxLength(50)]
        [EmailAddress]
        public required string Email { get; set; }

        [Required, MaxLength(15)]
        [Phone]
        public required string ContactNo { get; set; }

        [Required, MaxLength(500)]
        public required string Details { get; set; }
>>>>>>> wishlist

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<DoctorSchedule>? DoctorSchedules { get; set; }
        public ICollection<Favorite>? Favorites { get; set; }
    }
}