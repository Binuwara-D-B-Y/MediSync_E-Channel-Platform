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
        public string FullName { get; set; }

        [Required, MaxLength(100)]
        public string Email { get; set; }

        [Required, MaxLength(255)]
        public string PasswordHash { get; set; }

        [Required]
        public UserRole Role { get; set; }

        [MaxLength(15)]
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
