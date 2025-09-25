using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models.DTOs;

namespace Backend.Controllers
{
    /// <summary>
    /// Public controller for Doctor information
    /// Provides read-only access to doctor data for patients
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorsController : ControllerBase
    {
        private readonly IDoctorService _doctorService;
        private readonly ILogger<DoctorsController> _logger;

        public DoctorsController(IDoctorService doctorService, ILogger<DoctorsController> logger)
        {
            _doctorService = doctorService;
            _logger = logger;
        }

        /// <summary>
        /// Gets all active doctors
        /// </summary>
        /// <returns>List of doctors</returns>
        [HttpGet]
        public async Task<IActionResult> GetDoctors()
        {
            try
            {
                var result = await _doctorService.GetActiveDoctorsAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving doctors");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Gets a specific doctor by ID
        /// </summary>
        /// <param name="id">Doctor ID</param>
        /// <returns>Doctor details</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDoctor(int id)
        {
            try
            {
                var result = await _doctorService.GetDoctorByIdAsync(id);
                if (!result.Success)
                {
                    return NotFound(result);
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving doctor with ID: {DoctorId}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Search doctors by various criteria
        /// </summary>
        /// <param name="query">Search query</param>
        /// <param name="specializationId">Specialization ID filter</param>
        /// <returns>Filtered list of doctors</returns>
        [HttpGet("search")]
        public async Task<IActionResult> SearchDoctors(
            [FromQuery] string? query = null,
            [FromQuery] int? specializationId = null)
        {
            try
            {
                var result = await _doctorService.SearchDoctorsAsync(query, specializationId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching doctors");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Gets doctors by specialization
        /// </summary>
        /// <param name="specializationId">Specialization ID</param>
        /// <returns>Doctors in specialization</returns>
        [HttpGet("specialization/{specializationId}")]
        public async Task<IActionResult> GetDoctorsBySpecialization(int specializationId)
        {
            try
            {
                var result = await _doctorService.GetDoctorsBySpecializationAsync(specializationId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving doctors by specialization");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }
    }
}
