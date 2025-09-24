using System;
using System.Collections.Generic; // Needed for ICollection
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

        [Required, MaxLength(50)]
        public required string Specialization { get; set; }

        // Qualification is marked required but nullable (?) -> conflict
        // Either make it required & non-nullable OR optional
        [MaxLength(100)]
        public string? Qualification { get; set; }

        [Required, MaxLength(100)]
        [EmailAddress] // extra validation
        public required string Email { get; set; }

        [Required, MaxLength(25)]
        public required string ContactNo { get; set; }

        [Required, MaxLength(300)]
        public required string Details { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<DoctorSchedule>? DoctorSchedules { get; set; }
        public ICollection<Favorite>? Favorites { get; set; }
    }
}
