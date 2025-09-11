using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public enum TransactionStatus { pending, completed, failed }

    public class Transaction
    {
        [Key]
        public int TransactionId { get; set; }
        [Required]
        public int AppointmentId { get; set; }
        [ForeignKey("AppointmentId")]
        public Appointment Appointment { get; set; }
        [Required]
        public int PatientId { get; set; }
        [ForeignKey("PatientId")]
        public User Patient { get; set; }
        [Required, MaxLength(100)]
        public string PaymentId { get; set; }
        [Required, Column(TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }
        [Required]
        public TransactionStatus Status { get; set; } = TransactionStatus.completed;
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime PaymentDate { get; set; } = DateTime.Now;
    }
}
