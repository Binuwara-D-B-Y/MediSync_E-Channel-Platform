using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SeedController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("doctors")]
        public async Task<IActionResult> SeedDoctors()
        {
            if (_context.Doctors.Any())
            {
                return Ok(new { message = "Doctors already exist" });
            }

            var doctors = new List<Doctor>
            {
                new Doctor
                {
                    FullName = "Dr. Chamika Lakshan",
                    Specialization = "Cardiology",
                    ContactNumber = "0771234567",
                    Email = "chamika.lakshan@hospital.com",
                    Qualifications = "MBBS, MD (Cardiology)",
                    Details = "Expert in heart diseases and preventive cardiology.",
                    HospitalName = "National Hospital",
                    Address = "Colombo 10",
                    IsActive = true,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                },
                new Doctor
                {
                    FullName = "Dr. Nadeesha Perera",
                    Specialization = "Dermatology",
                    ContactNumber = "0772345678",
                    Email = "nadeesha.perera@hospital.com",
                    Qualifications = "MBBS, DDVL",
                    Details = "Specialist in skin and hair treatments.",
                    HospitalName = "Asiri Hospital",
                    Address = "Colombo 05",
                    IsActive = true,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                },
                new Doctor
                {
                    FullName = "Dr. Sameera Fernando",
                    Specialization = "Neurology",
                    ContactNumber = "0773456789",
                    Email = "sameera.fernando@hospital.com",
                    Qualifications = "MBBS, DM (Neurology)",
                    Details = "Focused on brain and nervous system disorders.",
                    HospitalName = "Lanka Hospital",
                    Address = "Colombo 06",
                    IsActive = true,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                },
                new Doctor
                {
                    FullName = "Dr. Kavindi Silva",
                    Specialization = "Pediatrics",
                    ContactNumber = "0774567890",
                    Email = "kavindi.silva@hospital.com",
                    Qualifications = "MBBS, MD (Pediatrics)",
                    Details = "Experienced in child healthcare and vaccination.",
                    HospitalName = "Lady Ridgeway Hospital",
                    Address = "Colombo 08",
                    IsActive = true,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                },
                new Doctor
                {
                    FullName = "Dr. Rashmi Jayawardena",
                    Specialization = "Gynecology",
                    ContactNumber = "0775678901",
                    Email = "rashmi.jayawardena@hospital.com",
                    Qualifications = "MBBS, MD (Gynecology)",
                    Details = "Specialist in women health and pregnancy care.",
                    HospitalName = "De Soysa Hospital",
                    Address = "Colombo 08",
                    IsActive = true,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                }
            };

            _context.Doctors.AddRange(doctors);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Successfully seeded {doctors.Count} doctors" });
        }
    }
}