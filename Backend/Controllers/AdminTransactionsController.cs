using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminTransactionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminTransactionsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/admintransactions
        [HttpGet]
        public async Task<ActionResult> GetTransactions()
        {
            var transactions = await _context.Transactions
                .Include(t => t.Patient)
                .Include(t => t.Appointment)
                .ThenInclude(a => a.DoctorSchedule)
                .ThenInclude(s => s.Doctor)
                .OrderByDescending(t => t.PaymentDate)
                .Select(t => new {
                    t.TransactionId,
                    t.PaymentId,
                    PatientName = t.Patient.FullName,
                    DoctorName = t.Appointment.DoctorSchedule.Doctor.FullName,
                    t.Amount,
                    t.PaymentMethod,
                    t.Status,
                    t.PaymentDate
                })
                .ToListAsync();

            return Ok(transactions);
        }
    }
}