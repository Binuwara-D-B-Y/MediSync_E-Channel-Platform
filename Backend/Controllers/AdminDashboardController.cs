using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminDashboardController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/admindashboard/stats
        [HttpGet("stats")]
        public async Task<ActionResult> GetDashboardStats()
        {
            var todayAppointments = await _context.Appointments
                .Include(a => a.DoctorSchedule)
                .CountAsync(a => a.DoctorSchedule.ScheduleDate.Date == DateTime.Today);

            var recentAppointments = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.DoctorSchedule)
                .ThenInclude(s => s.Doctor)
                .OrderByDescending(a => a.CreatedAt)
                .Take(5)
                .Select(a => new {
                    a.AppointmentId,
                    PatientName = a.Patient!.FullName,
                    DoctorName = a.DoctorSchedule!.Doctor.FullName,
                    ScheduleDate = a.DoctorSchedule.ScheduleDate,
                    BookingDate = a.CreatedAt,
                    a.Status
                })
                .ToListAsync();

            return Ok(new {
                todayAppointments,
                recentAppointments
            });
        }
    }
}