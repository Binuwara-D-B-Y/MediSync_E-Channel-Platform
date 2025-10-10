using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    /// <summary>
    /// Admin controller for Specialization management operations
    /// Returns specializations from doctors table
    /// </summary>
    [ApiController]
    [Route("api/admin/[controller]")]
    public class AdminSpecializationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AdminSpecializationsController> _logger;

        public AdminSpecializationsController(AppDbContext context, ILogger<AdminSpecializationsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Gets all specializations from doctors
        /// </summary>
        /// <param name="includeInactive">Include inactive specializations</param>
        /// <returns>List of specializations</returns>
        [HttpGet]
        public async Task<IActionResult> GetAllSpecializations([FromQuery] bool includeInactive = false)
        {
            try
            {
                _logger.LogInformation("Getting all specializations from doctors");

                var distinctSpecs = await _context.Doctors
                    .Where(d => includeInactive || d.IsActive)
                    .Where(d => !string.IsNullOrEmpty(d.Specialization))
                    .Select(d => d.Specialization)
                    .Distinct()
                    .OrderBy(s => s)
                    .ToListAsync();

                var specializations = distinctSpecs.Select((s, index) => new { 
                    specializationId = index + 1,
                    name = s, 
                    description = s,
                    isActive = true 
                }).ToList();

                return Ok(new { success = true, data = specializations });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting specializations");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSpecializationById(int id)
        {
            try
            {
                var distinctSpecs = await _context.Doctors
                    .Where(d => !string.IsNullOrEmpty(d.Specialization))
                    .Select(d => d.Specialization)
                    .Distinct()
                    .OrderBy(s => s)
                    .ToListAsync();

                if (id <= 0 || id > distinctSpecs.Count)
                {
                    return NotFound(new { success = false, message = "Specialization not found" });
                }

                var spec = distinctSpecs[id - 1];
                return Ok(new { 
                    success = true, 
                    data = new { 
                        specializationId = id, 
                        name = spec, 
                        description = spec,
                        isActive = true 
                    } 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting specialization by ID: {SpecializationId}", id);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        [HttpPost]
        public IActionResult CreateSpecialization([FromBody] dynamic createData)
        {
            return Ok(new { success = false, message = "Specializations are managed through doctors" });
        }

        [HttpPut("{id}")]
        public IActionResult UpdateSpecialization(int id, [FromBody] dynamic updateData)
        {
            return Ok(new { success = false, message = "Specializations are managed through doctors" });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteSpecialization(int id)
        {
            return Ok(new { success = false, message = "Specializations are managed through doctors" });
        }
    }
}
