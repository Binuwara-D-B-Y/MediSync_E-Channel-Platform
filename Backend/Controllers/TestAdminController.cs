using Microsoft.AspNetCore.Mvc;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    public class TestAdminController : ControllerBase
    {
        private static List<Doctor> _doctors = new List<Doctor>();
        private static int _nextId = 1;

        [HttpGet("admindoctors")]
        public ActionResult<IEnumerable<Doctor>> GetDoctors()
        {
            return Ok(_doctors);
        }

        [HttpPost("admindoctors")]
        public ActionResult<Doctor> CreateDoctor(Doctor doctor)
        {
            doctor.DoctorId = _nextId++;
            doctor.CreatedAt = DateTime.UtcNow;
            doctor.UpdatedAt = DateTime.UtcNow;
            _doctors.Add(doctor);
            return Ok(doctor);
        }
    }
}