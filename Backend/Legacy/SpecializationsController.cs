using Microsoft.AspNetCore.Mvc;
using Backend.Data;

namespace Backend.Controllers
{
    // [ApiController]
    // [Route("api/[controller]")]
    public class SpecializationsController_Legacy : ControllerBase
    {
        private readonly AppDbContext _context;
        public SpecializationsController_Legacy(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/specializations
        [HttpGet]
        public IActionResult GetAll()
        {
            var specs = _context.Doctors
                .Select(d => d.Specialization)
                .Distinct()
                .OrderBy(s => s)
                .ToList();
            return Ok(specs);
        }
    }
}
