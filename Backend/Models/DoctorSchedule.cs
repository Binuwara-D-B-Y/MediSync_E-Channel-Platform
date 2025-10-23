using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class DoctorSchedule
    {
        [Key]
        public int ScheduleId { get; set; }

        [Required]
        public int DoctorId { get; set; }

        [ForeignKey("DoctorId")]
        public Doctor? Doctor { get; set; }

        [Required]
        public DateTime ScheduleDate { get; set; }

        [Required]
        public TimeSpan StartTime { get; set; }

        [Required]
        public TimeSpan EndTime { get; set; }

        [Required]
        public int SlotDurationMinutes { get; set; } = 30; // Default 30 minutes

        [Required]
        public int MaxPatientsPerSlot { get; set; } = 1; // Default 1 per slot

        [Required]
        public int TotalSlots { get; set; }

<<<<<<< HEAD
        public int BookedSlots { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        [MaxLength(200)]
        public string? Notes { get; set; }
=======
        // automatically decreases when booked
        [Required]
        public int AvailableSlots { get; set; }
>>>>>>> wishlist

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

<<<<<<< HEAD
        public ICollection<Appointment>? Appointments { get; set; }
=======
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
>>>>>>> wishlist
    }
}
