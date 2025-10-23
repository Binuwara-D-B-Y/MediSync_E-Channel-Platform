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
        public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctors([FromQuery] string? name, [FromQuery] string? specialization)
        {
            try
            {
                var query = _context.Doctors.AsQueryable();

                if (!string.IsNullOrWhiteSpace(name))
                    query = query.Where(d => d.FullName.Contains(name));
                if (!string.IsNullOrWhiteSpace(specialization))
                    query = query.Where(d => d.Specialization == specialization);

                var doctors = await query.ToListAsync();
                return Ok(doctors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // GET: api/doctors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Doctor>> GetDoctor(int id)
        {
            try
            {
                var doctor = await _context.Doctors.FindAsync(id);
                if (doctor == null) return NotFound();
                return Ok(doctor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // POST: api/doctors
        [HttpPost]
        public async Task<ActionResult<Doctor>> CreateDoctor([FromBody] Doctor doctor)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                doctor.CreatedAt = DateTime.UtcNow;
                doctor.UpdatedAt = DateTime.UtcNow;
                
                _context.Doctors.Add(doctor);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetDoctor), new { id = doctor.DoctorId }, doctor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // PUT: api/doctors/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDoctor(int id, [FromBody] Doctor doctor)
        {
            try
            {
                var existingDoctor = await _context.Doctors.FindAsync(id);
                if (existingDoctor == null)
                    return NotFound();

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                existingDoctor.FullName = doctor.FullName;
                existingDoctor.Specialization = doctor.Specialization;
                existingDoctor.NIC = doctor.NIC;
                existingDoctor.Qualification = doctor.Qualification;
                existingDoctor.Email = doctor.Email;
                existingDoctor.ContactNo = doctor.ContactNo;
                existingDoctor.Details = doctor.Details;
                existingDoctor.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(existingDoctor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // DELETE: api/doctors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            try
            {
                var doctor = await _context.Doctors.FindAsync(id);
                if (doctor == null) return NotFound();

                _context.Doctors.Remove(doctor);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
