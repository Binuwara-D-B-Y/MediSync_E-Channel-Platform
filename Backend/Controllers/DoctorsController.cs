using Microsoft.AspNetCore.Mvc;
<<<<<<< HEAD
using Backend.Services;
using Backend.Models.DTOs;
=======
using Backend.Data;
using Backend.Models;
using Backend.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
>>>>>>> wishlist

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
<<<<<<< HEAD
        private readonly IDoctorService _doctorService;
        private readonly ILogger<DoctorsController> _logger;

        public DoctorsController(IDoctorService doctorService, ILogger<DoctorsController> logger)
        {
            _doctorService = doctorService;
            _logger = logger;
=======
        private readonly AppDbContext _context;
        private readonly IFavoriteRepository _favoriteRepository;
        
        public DoctorsController(AppDbContext context, IFavoriteRepository favoriteRepository)
        {
            _context = context;
            _favoriteRepository = favoriteRepository;
        }

        private int? GetUserIdIfAuthenticated()
        {
            var userIdClaim = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out int userId) ? userId : null;
>>>>>>> wishlist
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

<<<<<<< HEAD
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
=======
            var doctors = await query.ToListAsync();
            
            // Add favorite status if user is authenticated
            var userId = GetUserIdIfAuthenticated();
            if (userId.HasValue)
            {
                var doctorsWithFavorites = new List<object>();
                foreach (var doctor in doctors)
                {
                    var isFavorite = await _favoriteRepository.IsFavoriteAsync(userId.Value, doctor.DoctorId);
                    doctorsWithFavorites.Add(new
                    {
                        doctor.DoctorId,
                        doctor.FullName,
                        doctor.Specialization,
                        doctor.NIC,
                        doctor.Qualification,
                        doctor.Email,
                        doctor.ContactNo,
                        doctor.Details,
                        doctor.CreatedAt,
                        doctor.UpdatedAt,
                        IsFavorite = isFavorite
                    });
                }
                return Ok(doctorsWithFavorites);
            }
            
            return Ok(doctors);
>>>>>>> wishlist
        }
    }
}
