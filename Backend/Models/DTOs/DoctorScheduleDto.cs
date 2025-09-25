using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs
{
    public class CreateDoctorScheduleDto
    {
        [Required]
        public int DoctorId { get; set; }

        [Required]
        public DateTime ScheduleDate { get; set; }

        [Required]
        public TimeSpan StartTime { get; set; }

        [Required]
        public TimeSpan EndTime { get; set; }

        [Required, Range(15, 120)]
        public int SlotDurationMinutes { get; set; } = 30;

        [Required, Range(1, 10)]
        public int MaxPatientsPerSlot { get; set; } = 1;

        [MaxLength(200)]
        public string? Notes { get; set; }
    }

    public class UpdateDoctorScheduleDto
    {
        [Required]
        public int ScheduleId { get; set; }

        [Required]
        public DateTime ScheduleDate { get; set; }

        [Required]
        public TimeSpan StartTime { get; set; }

        [Required]
        public TimeSpan EndTime { get; set; }

        [Required, Range(15, 120)]
        public int SlotDurationMinutes { get; set; }

        [Required, Range(1, 10)]
        public int MaxPatientsPerSlot { get; set; }

        [MaxLength(200)]
        public string? Notes { get; set; }

        public bool IsActive { get; set; } = true;
    }

    public class DoctorScheduleResponseDto
    {
        public int ScheduleId { get; set; }
        public int DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public string SpecializationName { get; set; } = string.Empty;
        public DateTime ScheduleDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int SlotDurationMinutes { get; set; }
        public int MaxPatientsPerSlot { get; set; }
        public int TotalSlots { get; set; }
        public int BookedSlots { get; set; }
        public int AvailableSlots { get; set; }
        public bool IsActive { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class AppointmentOverviewDto
    {
        public int AppointmentId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string PatientContact { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public string SpecializationName { get; set; } = string.Empty;
        public DateTime ScheduleDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
