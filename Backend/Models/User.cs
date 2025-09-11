using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public enum UserRole { patient, admin }

    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required, MaxLength(100)]
        public required string FullName { get; set; }

        [Required, MaxLength(100)]
        public required string Email { get; set; }

        [Required, MaxLength(255)]
        public required string PasswordHash { get; set; }

        [MaxLength(12)]
        public required string NIC { get; set; }

        [Required]
        public UserRole Role { get; set; }

        [MaxLength(13)]
        public string? ContactNumber { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public ICollection<Appointment>? Appointments { get; set; }
        public ICollection<Favorite>? Favorites { get; set; }
        public ICollection<Transaction>? Transactions { get; set; }
    }
}
