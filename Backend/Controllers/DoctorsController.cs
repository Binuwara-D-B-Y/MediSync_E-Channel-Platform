using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public DoctorsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/doctors
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? name, [FromQuery] string? specialization, [FromQuery] DateTime? date)
        {
            var query = _context.Doctors.AsQueryable();

            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(d => d.FullName.Contains(name));
            if (!string.IsNullOrWhiteSpace(specialization))
                query = query.Where(d => d.Specialization == specialization);
            // Optionally filter by available date (requires join with schedules)
            // if (date.HasValue) { ... }

            var doctors = await query.ToListAsync();
            return Ok(doctors);
        }
    }
}
