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

        // POST: api/doctors/seed - Add sample data for development
        [HttpPost("seed")]
        public async Task<IActionResult> SeedData()
        {
            // Clear existing doctors first
            var existingDoctors = await _context.Doctors.ToListAsync();
            if (existingDoctors.Any())
            {
                _context.Doctors.RemoveRange(existingDoctors);
                await _context.SaveChangesAsync();
            }

            var sampleDoctors = new List<Doctor>
            {
                new Doctor
                {
                    FullName = "Dr. Lakshan Pathirana",
                    Specialization = "Cardiology",
                    Details = "Expert in heart diseases and preventive cardiology."
                },
                new Doctor
                {
                    FullName = "Dr. Nadeesha Perera",
                    Specialization = "Dermatology",
                    Details = "Specialist in skin and hair treatments."
                },
                new Doctor
                {
                    FullName = "Dr. Sameera Fernando",
                    Specialization = "Neurology",
                    Details = "Focused on brain and nervous system disorders."
                },
                new Doctor
                {
                    FullName = "Dr. Kavindi Silva",
                    Specialization = "Pediatrics",
                    Details = "Experienced in child healthcare and vaccination."
                },
                new Doctor
                {
                    FullName = "Dr. Rashmi Jayawardena",
                    Specialization = "Gynecology",
                    Details = "Specialist in women health and pregnancy care."
                },
                new Doctor
                {
                    FullName = "Dr. Harsha Wijesinghe",
                    Specialization = "Orthopedics",
                    Details = "Expert in bone, joint, and spine treatments."
                },
                new Doctor
                {
                    FullName = "Dr. Tharindu Gunasekara",
                    Specialization = "ENT",
                    Details = "Treats ear, nose, and throat disorders."
                },
                new Doctor
                {
                    FullName = "Dr. Sanduni Rajapaksha",
                    Specialization = "Ophthalmology",
                    Details = "Specialist in eye treatments and surgeries."
                },
                new Doctor
                {
                    FullName = "Dr. Lasitha Fernando",
                    Specialization = "Psychiatry",
                    Details = "Provides mental health and counseling services."
                },
                new Doctor
                {
                    FullName = "Dr. Anushka Perera",
                    Specialization = "General Medicine",
                    Details = "General physician for all age groups."
                }
            };

            _context.Doctors.AddRange(sampleDoctors);
            await _context.SaveChangesAsync();

            return Ok($"Successfully added {sampleDoctors.Count} sample doctors to the database");
        }
    }
}
