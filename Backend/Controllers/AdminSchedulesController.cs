using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminSchedulesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminSchedulesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/adminschedules
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DoctorSchedule>>> GetSchedules()
        {
            return await _context.DoctorSchedules
                .Include(s => s.Doctor)
                .Include(s => s.Appointments)
                .ToListAsync();
        }

        // GET: api/admin/adminschedules/doctor/5
        [HttpGet("doctor/{doctorId}")]
        public async Task<ActionResult<IEnumerable<DoctorSchedule>>> GetSchedulesByDoctor(int doctorId)
        {
            return await _context.DoctorSchedules
                .Where(s => s.DoctorId == doctorId)
                .Include(s => s.Doctor)
                .Include(s => s.Appointments)
                .ToListAsync();
        }

        // GET: api/admin/adminschedules/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DoctorSchedule>> GetSchedule(int id)
        {
            var schedule = await _context.DoctorSchedules
                .Include(s => s.Doctor)
                .Include(s => s.Appointments)
                .FirstOrDefaultAsync(s => s.ScheduleId == id);

            if (schedule == null)
            {
                return NotFound();
            }

            return schedule;
        }

        // POST: api/admin/adminschedules
        [HttpPost]
        public async Task<ActionResult<DoctorSchedule>> CreateSchedule(DoctorSchedule schedule)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verify doctor exists
            var doctorExists = await _context.Doctors.AnyAsync(d => d.DoctorId == schedule.DoctorId);
            if (!doctorExists)
            {
                return BadRequest("Doctor not found");
            }

            // Set available slots equal to total slots initially
            schedule.AvailableSlots = schedule.TotalSlots;
            
            _context.DoctorSchedules.Add(schedule);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSchedule), new { id = schedule.ScheduleId }, schedule);
        }

        // PUT: api/admin/adminschedules/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSchedule(int id, DoctorSchedule schedule)
        {
            if (id != schedule.ScheduleId)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            schedule.UpdatedAt = DateTime.UtcNow;
            _context.Entry(schedule).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScheduleExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/admin/adminschedules/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSchedule(int id)
        {
            var schedule = await _context.DoctorSchedules.FindAsync(id);
            if (schedule == null)
            {
                return NotFound();
            }

            // Check if schedule has appointments
            var hasAppointments = await _context.Appointments.AnyAsync(a => a.ScheduleId == id);
            if (hasAppointments)
            {
                return BadRequest("Cannot delete schedule with existing appointments");
            }

            _context.DoctorSchedules.Remove(schedule);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ScheduleExists(int id)
        {
            return _context.DoctorSchedules.Any(e => e.ScheduleId == id);
        }
    }
}