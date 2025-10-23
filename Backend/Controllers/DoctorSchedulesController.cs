using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class DoctorSchedulesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DoctorSchedulesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> GetSchedules()
        {
            try
            {
                var schedules = await _context.DoctorSchedules
                    .Include(s => s.Doctor)
                    .Select(s => new {
                        s.ScheduleId,
                        s.DoctorId,
                        DoctorName = s.Doctor.FullName,
                        s.ScheduleDate,
                        StartTime = s.StartTime.ToString(@"hh\:mm"),
                        EndTime = s.EndTime.ToString(@"hh\:mm"),
                        s.TotalSlots,
                        s.AvailableSlots
                    })
                    .ToListAsync();
                    
                return Ok(schedules);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CreateSchedule([FromBody] CreateScheduleRequest request)
        {
            try
            {
                var schedule = new DoctorSchedule
                {
                    DoctorId = request.DoctorId,
                    ScheduleDate = DateTime.Parse(request.ScheduleDate),
                    StartTime = TimeSpan.Parse(request.StartTime + ":00"),
                    EndTime = TimeSpan.Parse(request.EndTime + ":00"),
                    TotalSlots = request.TotalSlots,
                    AvailableSlots = request.TotalSlots,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                
                _context.DoctorSchedules.Add(schedule);
                await _context.SaveChangesAsync();
                return Ok(schedule);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateSchedule(int id, [FromBody] CreateScheduleRequest request)
        {
            try
            {
                var existing = await _context.DoctorSchedules.FindAsync(id);
                if (existing == null) return NotFound();

                existing.DoctorId = request.DoctorId;
                existing.ScheduleDate = DateTime.Parse(request.ScheduleDate);
                existing.StartTime = TimeSpan.Parse(request.StartTime + ":00");
                existing.EndTime = TimeSpan.Parse(request.EndTime + ":00");
                existing.TotalSlots = request.TotalSlots;
                existing.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(existing);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSchedule(int id)
        {
            try
            {
                var schedule = await _context.DoctorSchedules.FindAsync(id);
                if (schedule == null) return NotFound();

                _context.DoctorSchedules.Remove(schedule);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }

    public class CreateScheduleRequest
    {
        public int DoctorId { get; set; }
        public string ScheduleDate { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int TotalSlots { get; set; }
    }
}