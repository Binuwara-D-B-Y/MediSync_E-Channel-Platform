using Backend.Models.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost]
        public async Task<ActionResult<BookingResponseDto>> CreateBooking([FromBody] BookingRequestDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _bookingService.CreateBookingAsync(request);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your booking" });
            }
        }

        [HttpGet("{appointmentId}")]
        public async Task<ActionResult<BookingResponseDto>> GetBooking(int appointmentId)
        {
            try
            {
                var result = await _bookingService.GetBookingAsync(appointmentId);
                if (result == null)
                    return NotFound(new { message = "Booking not found" });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the booking" });
            }
        }

        [HttpGet("user/{patientId}")]
        public async Task<ActionResult<List<UserAppointmentDto>>> GetUserAppointments(int patientId)
        {
            try
            {
                var appointments = await _bookingService.GetUserAppointmentsAsync(patientId);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving appointments" });
            }
        }
    }
}