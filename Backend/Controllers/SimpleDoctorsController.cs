using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SimpleDoctorsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SimpleDoctorsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetDoctors()
        {
            var doctors = _context.Doctors.ToList();
            return Ok(doctors);
        }

        [HttpPost]
        public IActionResult CreateDoctor([FromBody] Doctor doctor)
        {
            doctor.CreatedAt = DateTime.UtcNow;
            doctor.UpdatedAt = DateTime.UtcNow;
            _context.Doctors.Add(doctor);
            _context.SaveChanges();
            return Ok(doctor);
        }
    }
}