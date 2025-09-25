using Microsoft.AspNetCore.Mvc;
using Backend.Models.DTOs;
using Backend.Services;
using System.ComponentModel.DataAnnotations;

namespace Backend.Controllers
{
    /// <summary>
    /// Admin controller for Doctor management operations
    /// Provides CRUD operations for doctors with enhanced features
    /// </summary>
    [ApiController]
    [Route("api/admin/[controller]")]
    public class AdminDoctorsController : ControllerBase
    {
        private readonly IDoctorService _doctorService;
        private readonly ILogger<AdminDoctorsController> _logger;

        public AdminDoctorsController(IDoctorService doctorService, ILogger<AdminDoctorsController> logger)
        {
            _doctorService = doctorService;
            _logger = logger;
        }

        /// <summary>
        /// Gets all doctors with pagination and filtering
        /// </summary>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="pageSize">Page size (default: 10)</param>
        /// <param name="search">Search term for name, qualifications, or hospital</param>
        /// <param name="specializationId">Filter by specialization</param>
        /// <param name="isActive">Filter by active status</param>
        /// <returns>Paginated list of doctors</returns>
        [HttpGet]
        public async Task<IActionResult> GetAllDoctors(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null,
            [FromQuery] int? specializationId = null,
            [FromQuery] bool? isActive = null)
        {
            try
            {
                _logger.LogInformation("Getting all doctors - Page: {Page}, PageSize: {PageSize}, Search: {Search}", 
                    page, pageSize, search);

                ApiResponseDto<IEnumerable<DoctorResponseDto>> result;

                if (!string.IsNullOrWhiteSpace(search) || specializationId.HasValue)
                {
                    result = await _doctorService.SearchDoctorsAsync(search, specializationId);
                }
                else if (isActive.HasValue && isActive.Value)
                {
                    result = await _doctorService.GetActiveDoctorsAsync();
                }
                else
                {
                    result = await _doctorService.GetAllDoctorsAsync();
                }

                if (!result.Success)
                {
                    return BadRequest(result);
                }

                // Apply pagination
                var doctors = result.Data?.ToList() ?? new List<DoctorResponseDto>();
                var totalCount = doctors.Count;
                var pagedDoctors = doctors
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var response = new
                {
                    Success = true,
                    Data = pagedDoctors,
                    Message = result.Message,
                    Pagination = new
                    {
                        Page = page,
                        PageSize = pageSize,
                        TotalCount = totalCount,
                        TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all doctors");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Gets a specific doctor by ID
        /// </summary>
        /// <param name="id">Doctor ID</param>
        /// <returns>Doctor details</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDoctorById(int id)
        {
            try
            {
                _logger.LogInformation("Getting doctor by ID: {DoctorId}", id);

                if (id <= 0)
                {
                    return BadRequest(new { Success = false, Message = "Invalid doctor ID" });
                }

                var result = await _doctorService.GetDoctorByIdAsync(id);
                
                if (!result.Success)
                {
                    return NotFound(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting doctor by ID: {DoctorId}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Creates a new doctor
        /// </summary>
        /// <param name="createDto">Doctor creation data</param>
        /// <returns>Created doctor</returns>
        [HttpPost]
        public async Task<IActionResult> CreateDoctor([FromBody] CreateDoctorDto createDto)
        {
            try
            {
                _logger.LogInformation("Creating new doctor: {DoctorName}", createDto.FullName);

                if (!ModelState.IsValid)
                {
                    return BadRequest(new { Success = false, Message = "Invalid input data", Errors = ModelState });
                }

                var result = await _doctorService.CreateDoctorAsync(createDto);
                
                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return CreatedAtAction(nameof(GetDoctorById), new { id = result.Data?.DoctorId }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating doctor: {DoctorName}", createDto.FullName);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Updates an existing doctor
        /// </summary>
        /// <param name="id">Doctor ID</param>
        /// <param name="updateDto">Doctor update data</param>
        /// <returns>Updated doctor</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDoctor(int id, [FromBody] UpdateDoctorDto updateDto)
        {
            try
            {
                _logger.LogInformation("Updating doctor: {DoctorId}", id);

                if (id <= 0 || id != updateDto.DoctorId)
                {
                    return BadRequest(new { Success = false, Message = "Invalid doctor ID" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(new { Success = false, Message = "Invalid input data", Errors = ModelState });
                }

                var result = await _doctorService.UpdateDoctorAsync(updateDto);
                
                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating doctor: {DoctorId}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Deletes a doctor
        /// </summary>
        /// <param name="id">Doctor ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            try
            {
                _logger.LogInformation("Deleting doctor: {DoctorId}", id);

                if (id <= 0)
                {
                    return BadRequest(new { Success = false, Message = "Invalid doctor ID" });
                }

                var result = await _doctorService.DeleteDoctorAsync(id);
                
                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting doctor: {DoctorId}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Gets doctors by specialization
        /// </summary>
        /// <param name="specializationId">Specialization ID</param>
        /// <returns>List of doctors in the specialization</returns>
        [HttpGet("specialization/{specializationId}")]
        public async Task<IActionResult> GetDoctorsBySpecialization(int specializationId)
        {
            try
            {
                _logger.LogInformation("Getting doctors by specialization: {SpecializationId}", specializationId);

                if (specializationId <= 0)
                {
                    return BadRequest(new { Success = false, Message = "Invalid specialization ID" });
                }

                var result = await _doctorService.GetDoctorsBySpecializationAsync(specializationId);
                
                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting doctors by specialization: {SpecializationId}", specializationId);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Gets doctor statistics including schedule and appointment counts
        /// </summary>
        /// <returns>Doctor statistics</returns>
        [HttpGet("statistics")]
        public async Task<IActionResult> GetDoctorStatistics()
        {
            try
            {
                _logger.LogInformation("Getting doctor statistics");

                var result = await _doctorService.GetDoctorsWithStatsAsync();
                
                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting doctor statistics");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Searches doctors with advanced filtering
        /// </summary>
        /// <param name="searchTerm">Search term</param>
        /// <param name="specializationId">Specialization filter</param>
        /// <param name="minExperience">Minimum experience years</param>
        /// <param name="maxExperience">Maximum experience years</param>
        /// <returns>Filtered doctors</returns>
        [HttpGet("search")]
        public async Task<IActionResult> SearchDoctors(
            [FromQuery] string? searchTerm = null,
            [FromQuery] int? specializationId = null,
            [FromQuery] int? minExperience = null,
            [FromQuery] int? maxExperience = null)
        {
            try
            {
                _logger.LogInformation("Searching doctors with term: {SearchTerm}", searchTerm);

                var result = await _doctorService.SearchDoctorsAsync(searchTerm, specializationId);
                
                if (!result.Success)
                {
                    return BadRequest(result);
                }

                // Apply experience filters if provided
                var doctors = result.Data?.ToList() ?? new List<DoctorResponseDto>();
                
                if (minExperience.HasValue)
                {
                    doctors = doctors.Where(d => d.ExperienceYears >= minExperience.Value).ToList();
                }
                
                if (maxExperience.HasValue)
                {
                    doctors = doctors.Where(d => d.ExperienceYears <= maxExperience.Value).ToList();
                }

                var filteredResult = new ApiResponseDto<IEnumerable<DoctorResponseDto>>
                {
                    Success = true,
                    Data = doctors,
                    Message = $"Found {doctors.Count} doctors matching criteria"
                };

                return Ok(filteredResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching doctors");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Seeds the database with sample doctors and specializations
        /// </summary>
        [HttpPost("seed")]
        public async Task<IActionResult> SeedDatabase()
        {
            try
            {
                _logger.LogInformation("Starting database seeding...");

                // First, let's check if we already have data
                var existingDoctors = await _doctorService.GetAllDoctorsAsync();
                if (existingDoctors.Data?.Any() == true)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Database already contains data",
                        doctorCount = existingDoctors.Data.Count()
                    });
                }

                // Create sample doctors directly using the service
                var sampleDoctors = new[]
                {
                    new CreateDoctorDto
                    {
                        FullName = "Dr. Lakshan Pathirana",
                        SpecializationId = 1,
                        ContactNumber = "+94771234567",
                        Email = "lakshan.pathirana@medisync.lk",
                        Qualifications = "MBBS, MD (Cardiology), FRCP",
                        ExperienceYears = 15,
                        Details = "Senior Consultant Cardiologist with expertise in interventional cardiology",
                        HospitalName = "National Hospital of Sri Lanka",
                        Address = "Colombo 10"
                    },
                    new CreateDoctorDto
                    {
                        FullName = "Dr. Nadeesha Perera",
                        SpecializationId = 2,
                        ContactNumber = "+94772345678",
                        Email = "nadeesha.perera@medisync.lk",
                        Qualifications = "MBBS, MD (Dermatology), MRCP",
                        ExperienceYears = 12,
                        Details = "Consultant Dermatologist specializing in cosmetic and medical dermatology",
                        HospitalName = "Asiri Medical Hospital",
                        Address = "Colombo 05"
                    },
                    new CreateDoctorDto
                    {
                        FullName = "Dr. Mahima Bashitha",
                        SpecializationId = 3,
                        ContactNumber = "+94773456789",
                        Email = "bashitha.mahima@medisync.lk",
                        Qualifications = "MBBS, MD (Neurology), FRCP",
                        ExperienceYears = 18,
                        Details = "Senior Neurologist with expertise in stroke management and epilepsy",
                        HospitalName = "Lanka Hospital",
                        Address = "Colombo 06"
                    },
                    new CreateDoctorDto
                    {
                        FullName = "Dr. Priya Fernando",
                        SpecializationId = 4,
                        ContactNumber = "+94774567890",
                        Email = "priya.fernando@medisync.lk",
                        Qualifications = "MBBS, MS (Orthopedics), FRCS",
                        ExperienceYears = 20,
                        Details = "Orthopedic Surgeon specializing in joint replacement and sports medicine",
                        HospitalName = "Nawaloka Hospital",
                        Address = "Colombo 02"
                    },
                    new CreateDoctorDto
                    {
                        FullName = "Dr. Saman Silva",
                        SpecializationId = 5,
                        ContactNumber = "+94775678901",
                        Email = "saman.silva@medisync.lk",
                        Qualifications = "MBBS, MD (Pediatrics), MRCPCH",
                        ExperienceYears = 14,
                        Details = "Consultant Pediatrician with expertise in neonatal care",
                        HospitalName = "Lady Ridgeway Hospital",
                        Address = "Colombo 08"
                    }
                };

                var createdCount = 0;
                foreach (var doctorDto in sampleDoctors)
                {
                    try
                    {
                        var result = await _doctorService.CreateDoctorAsync(doctorDto);
                        if (result.Success)
                        {
                            createdCount++;
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Failed to create doctor: {DoctorName}", doctorDto.FullName);
                    }
                }

                _logger.LogInformation("Database seeding completed. Created {Count} doctors", createdCount);

                return Ok(new
                {
                    success = true,
                    message = "Database seeded successfully",
                    doctorsCreated = createdCount,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while seeding database");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error occurred while seeding database",
                    error = ex.Message
                });
            }
        }
    }
}
