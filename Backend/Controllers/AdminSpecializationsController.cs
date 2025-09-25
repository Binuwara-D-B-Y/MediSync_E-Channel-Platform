using Microsoft.AspNetCore.Mvc;
using Backend.Models.DTOs;
using Backend.Services;

namespace Backend.Controllers
{
    /// <summary>
    /// Admin controller for Specialization management operations
    /// Provides CRUD operations for medical specializations
    /// </summary>
    [ApiController]
    [Route("api/admin/[controller]")]
    public class AdminSpecializationsController : ControllerBase
    {
        private readonly ISpecializationService _specializationService;
        private readonly ILogger<AdminSpecializationsController> _logger;

        public AdminSpecializationsController(ISpecializationService specializationService, ILogger<AdminSpecializationsController> logger)
        {
            _specializationService = specializationService;
            _logger = logger;
        }

        /// <summary>
        /// Gets all specializations
        /// </summary>
        /// <param name="includeInactive">Include inactive specializations</param>
        /// <returns>List of specializations</returns>
        [HttpGet]
        public async Task<IActionResult> GetAllSpecializations([FromQuery] bool includeInactive = false)
        {
            try
            {
                _logger.LogInformation("Getting all specializations - IncludeInactive: {IncludeInactive}", includeInactive);

                var result = includeInactive 
                    ? await _specializationService.GetAllSpecializationsAsync()
                    : await _specializationService.GetActiveSpecializationsAsync();
                
                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all specializations");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Gets a specific specialization by ID
        /// </summary>
        /// <param name="id">Specialization ID</param>
        /// <returns>Specialization details</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSpecializationById(int id)
        {
            try
            {
                _logger.LogInformation("Getting specialization by ID: {SpecializationId}", id);

                if (id <= 0)
                {
                    return BadRequest(new { Success = false, Message = "Invalid specialization ID" });
                }

                var result = await _specializationService.GetSpecializationByIdAsync(id);
                
                if (!result.Success)
                {
                    return NotFound(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting specialization by ID: {SpecializationId}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Creates a new specialization
        /// </summary>
        /// <param name="createDto">Specialization creation data</param>
        /// <returns>Created specialization</returns>
        [HttpPost]
        public async Task<IActionResult> CreateSpecialization([FromBody] CreateSpecializationDto createDto)
        {
            try
            {
                _logger.LogInformation("Creating new specialization: {SpecializationName}", createDto.Name);

                if (!ModelState.IsValid)
                {
                    return BadRequest(new { Success = false, Message = "Invalid input data", Errors = ModelState });
                }

                var result = await _specializationService.CreateSpecializationAsync(createDto);
                
                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return CreatedAtAction(nameof(GetSpecializationById), new { id = result.Data?.SpecializationId }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating specialization: {SpecializationName}", createDto.Name);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Updates an existing specialization
        /// </summary>
        /// <param name="id">Specialization ID</param>
        /// <param name="updateDto">Specialization update data</param>
        /// <returns>Updated specialization</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSpecialization(int id, [FromBody] UpdateSpecializationDto updateDto)
        {
            try
            {
                _logger.LogInformation("Updating specialization: {SpecializationId}", id);

                if (id <= 0 || id != updateDto.SpecializationId)
                {
                    return BadRequest(new { Success = false, Message = "Invalid specialization ID" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(new { Success = false, Message = "Invalid input data", Errors = ModelState });
                }

                var result = await _specializationService.UpdateSpecializationAsync(updateDto);
                
                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating specialization: {SpecializationId}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Deletes a specialization
        /// </summary>
        /// <param name="id">Specialization ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSpecialization(int id)
        {
            try
            {
                _logger.LogInformation("Deleting specialization: {SpecializationId}", id);

                if (id <= 0)
                {
                    return BadRequest(new { Success = false, Message = "Invalid specialization ID" });
                }

                var result = await _specializationService.DeleteSpecializationAsync(id);
                
                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting specialization: {SpecializationId}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Gets specialization statistics including doctor counts
        /// </summary>
        /// <returns>Specialization statistics</returns>
        [HttpGet("statistics")]
        public async Task<IActionResult> GetSpecializationStatistics()
        {
            try
            {
                _logger.LogInformation("Getting specialization statistics");

                var result = await _specializationService.GetSpecializationsWithStatsAsync();
                
                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting specialization statistics");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Seeds the database with sample specializations
        /// </summary>
        [HttpPost("seed")]
        public async Task<IActionResult> SeedSpecializations()
        {
            try
            {
                _logger.LogInformation("Starting specializations seeding...");

                // Check if we already have specializations
                var existing = await _specializationService.GetAllSpecializationsAsync();
                if (existing.Data?.Any() == true)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Specializations already exist",
                        count = existing.Data.Count()
                    });
                }

                // Create sample specializations
                var specializations = new[]
                {
                    new { Name = "Cardiology", Description = "Heart and cardiovascular system" },
                    new { Name = "Dermatology", Description = "Skin, hair, and nail conditions" },
                    new { Name = "Neurology", Description = "Nervous system disorders" },
                    new { Name = "Orthopedics", Description = "Bone, joint, and muscle conditions" },
                    new { Name = "Pediatrics", Description = "Medical care for children" },
                    new { Name = "Psychiatry", Description = "Mental health and behavioral disorders" },
                    new { Name = "General Medicine", Description = "General medical care and consultation" },
                    new { Name = "Gynecology", Description = "Women's reproductive health" },
                    new { Name = "Ophthalmology", Description = "Eye and vision care" },
                    new { Name = "ENT", Description = "Ear, nose, and throat conditions" }
                };

                var createdCount = 0;
                foreach (var spec in specializations)
                {
                    try
                    {
                        var createDto = new CreateSpecializationDto
                        {
                            Name = spec.Name,
                            Description = spec.Description
                        };
                        var result = await _specializationService.CreateSpecializationAsync(createDto);
                        if (result.Success)
                        {
                            createdCount++;
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Failed to create specialization: {Name}", spec.Name);
                    }
                }

                return Ok(new
                {
                    success = true,
                    message = "Specializations seeded successfully",
                    created = createdCount,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding specializations");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error seeding specializations",
                    error = ex.Message
                });
            }
        }
    }
}
