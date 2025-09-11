using System;
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

        [Required, MaxLength(300)]
        public required string Details { get; set; }
        // [Required, MaxLength(100)]
        // public string HospitalName { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public ICollection<DoctorSchedule>? DoctorSchedules { get; set; }
        public ICollection<Favorite>? Favorites { get; set; }
    }
}
