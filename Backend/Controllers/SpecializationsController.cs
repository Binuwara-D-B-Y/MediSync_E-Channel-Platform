using Microsoft.AspNetCore.Mvc;
using Backend.Services;

namespace Backend.Controllers
{
    /// <summary>
    /// Public controller for Specialization information
    /// Provides read-only access to specialization data for patients
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class SpecializationsController : ControllerBase
    {
        private readonly ISpecializationService _specializationService;
        private readonly ILogger<SpecializationsController> _logger;

        public SpecializationsController(ISpecializationService specializationService, ILogger<SpecializationsController> logger)
        {
            _specializationService = specializationService;
            _logger = logger;
        }

        /// <summary>
        /// Gets all active specializations
        /// </summary>
        /// <returns>List of specializations</returns>
        [HttpGet]
        public async Task<IActionResult> GetSpecializations()
        {
            try
            {
                var result = await _specializationService.GetAllSpecializationsAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving specializations");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Gets a specific specialization by ID
        /// </summary>
        /// <param name="id">Specialization ID</param>
        /// <returns>Specialization details</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSpecialization(int id)
        {
            try
            {
                var result = await _specializationService.GetSpecializationByIdAsync(id);
                if (!result.Success)
                {
                    return NotFound(result);
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving specialization with ID: {SpecializationId}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }
    }
}
