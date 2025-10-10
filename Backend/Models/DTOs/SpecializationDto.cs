using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs
{
    public class CreateSpecializationDto
    {
        [Required, MaxLength(50)]
        public required string Name { get; set; }

        [MaxLength(200)]
        public string? Description { get; set; }
    }

    public class UpdateSpecializationDto
    {
        [Required]
        public int SpecializationId { get; set; }

        [Required, MaxLength(50)]
        public required string Name { get; set; }

        [MaxLength(200)]
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;
    }

    public class SpecializationResponseDto
    {
        public int SpecializationId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
