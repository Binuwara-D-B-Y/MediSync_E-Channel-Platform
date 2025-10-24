using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs
{
    public class ResetPasswordDto
    {
        [Required]
        public required string Token { get; set; }

        [Required]
        [MinLength(6)]
        public required string NewPassword { get; set; }
    }
}