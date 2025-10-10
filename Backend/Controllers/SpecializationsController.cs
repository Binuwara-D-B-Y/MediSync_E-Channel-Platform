using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SpecializationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SpecializationsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSpecializations()
        {
            try
            {
                var specializations = await _context.Doctors
                    .Where(d => d.IsActive && !string.IsNullOrEmpty(d.Specialization))
                    .Select(d => d.Specialization)
                    .Distinct()
                    .OrderBy(s => s)
                    .Select(s => new { name = s })
                    .ToListAsync();

                return Ok(new { data = specializations });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to fetch specializations", error = ex.Message });
            }
        }
    }
}