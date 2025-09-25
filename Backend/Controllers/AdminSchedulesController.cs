using Microsoft.AspNetCore.Mvc;
using Backend.Models.DTOs;
using Backend.Services;

namespace Backend.Controllers
{
    /// <summary>
    /// Admin controller for Doctor scheduling operations
    /// </summary>
    [ApiController]
    [Route("api/admin/[controller]")]
    public class AdminSchedulesController : ControllerBase
    {
        private readonly IDoctorScheduleService _scheduleService;
        private readonly ILogger<AdminSchedulesController> _logger;

        public AdminSchedulesController(IDoctorScheduleService scheduleService, ILogger<AdminSchedulesController> logger)
        {
            _scheduleService = scheduleService;
            _logger = logger;
        }

        /// <summary>
        /// Gets schedules with optional filters and pagination
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetSchedules(
            [FromQuery] int? doctorId = null,
            [FromQuery] DateTime? date = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _scheduleService.GetAllSchedulesAsync(doctorId, date);
                if (!result.Success)
                {
                    return BadRequest(result);
                }

                var list = result.Data?.ToList() ?? new List<DoctorScheduleResponseDto>();
                var totalCount = list.Count;
                var paged = list.Skip((page - 1) * pageSize).Take(pageSize).ToList();

                return Ok(new
                {
                    Success = true,
                    Data = paged,
                    Pagination = new
                    {
                        Page = page,
                        PageSize = pageSize,
                        TotalCount = totalCount,
                        TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting schedules");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Get schedule by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                if (id <= 0) return BadRequest(new { Success = false, Message = "Invalid schedule ID" });
                var result = await _scheduleService.GetScheduleByIdAsync(id);
                if (!result.Success) return NotFound(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting schedule by id {Id}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Create a new schedule
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateDoctorScheduleDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { Success = false, Message = "Invalid input data", Errors = ModelState });
                }
                var result = await _scheduleService.CreateScheduleAsync(dto);
                if (!result.Success) return BadRequest(result);
                return CreatedAtAction(nameof(GetById), new { id = result.Data?.ScheduleId }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating schedule");
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Update schedule
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateDoctorScheduleDto dto)
        {
            try
            {
                if (id <= 0 || id != dto.ScheduleId)
                {
                    return BadRequest(new { Success = false, Message = "Invalid schedule ID" });
                }
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { Success = false, Message = "Invalid input data", Errors = ModelState });
                }
                var result = await _scheduleService.UpdateScheduleAsync(dto);
                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating schedule {Id}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Delete schedule
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                if (id <= 0) return BadRequest(new { Success = false, Message = "Invalid schedule ID" });
                var result = await _scheduleService.DeleteScheduleAsync(id);
                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting schedule {Id}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Get upcoming schedules for a doctor
        /// </summary>
        [HttpGet("doctor/{doctorId}/upcoming")]
        public async Task<IActionResult> Upcoming(int doctorId, [FromQuery] int days = 30)
        {
            try
            {
                if (doctorId <= 0) return BadRequest(new { Success = false, Message = "Invalid doctor ID" });
                var result = await _scheduleService.GetUpcomingSchedulesAsync(doctorId, days);
                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting upcoming schedules for doctor {DoctorId}", doctorId);
                return StatusCode(500, new { Success = false, Message = "Internal server error" });
            }
        }

        /// <summary>
        /// Seeds the database with sample schedules for existing doctors
        /// </summary>
        [HttpPost("seed")]
        public async Task<IActionResult> SeedSchedules()
        {
            try
            {
                _logger.LogInformation("Starting schedules seeding...");

                // Check if we already have schedules
                var existing = await _scheduleService.GetAllSchedulesAsync();
                if (existing.Data?.Any() == true)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Schedules already exist",
                        count = existing.Data?.Count() ?? 0
                    });
                }

                // Create sample schedules for the next 7 days for each doctor
                var sampleSchedules = new List<CreateDoctorScheduleDto>();
                var doctorIds = new[] { 1, 2, 3, 4, 5 }; // Our seeded doctors

                for (int dayOffset = 0; dayOffset < 7; dayOffset++)
                {
                    var scheduleDate = DateTime.Today.AddDays(dayOffset);
                    
                    foreach (var doctorId in doctorIds)
                    {
                        // Skip weekends for some doctors
                        if (scheduleDate.DayOfWeek == DayOfWeek.Saturday || scheduleDate.DayOfWeek == DayOfWeek.Sunday)
                        {
                            if (doctorId % 2 == 0) continue; // Even doctorIds skip weekends
                        }

                        // Different time slots for different doctors
                        var (startTime, endTime) = doctorId switch
                        {
                            1 => (new TimeSpan(9, 0, 0), new TimeSpan(12, 0, 0)),   // Morning
                            2 => (new TimeSpan(14, 0, 0), new TimeSpan(17, 0, 0)),  // Afternoon
                            3 => (new TimeSpan(10, 0, 0), new TimeSpan(13, 0, 0)),  // Late morning
                            4 => (new TimeSpan(15, 0, 0), new TimeSpan(18, 0, 0)),  // Late afternoon
                            5 => (new TimeSpan(8, 0, 0), new TimeSpan(11, 0, 0)),   // Early morning
                            _ => (new TimeSpan(9, 0, 0), new TimeSpan(12, 0, 0))
                        };

                        sampleSchedules.Add(new CreateDoctorScheduleDto
                        {
                            DoctorId = doctorId,
                            ScheduleDate = scheduleDate,
                            StartTime = startTime,
                            EndTime = endTime,
                            SlotDurationMinutes = doctorId == 3 ? 45 : 30, // Neurologist gets longer slots
                            MaxPatientsPerSlot = 1,
                            Notes = $"Regular consultation session - {scheduleDate:dddd}"
                        });
                    }
                }

                var createdCount = 0;
                foreach (var scheduleDto in sampleSchedules)
                {
                    try
                    {
                        var result = await _scheduleService.CreateScheduleAsync(scheduleDto);
                        if (result.Success)
                        {
                            createdCount++;
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Failed to create schedule for doctor {DoctorId} on {Date}", 
                            scheduleDto.DoctorId, scheduleDto.ScheduleDate);
                    }
                }

                return Ok(new
                {
                    success = true,
                    message = "Schedules seeded successfully",
                    created = createdCount,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding schedules");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error seeding schedules",
                    error = ex.Message
                });
            }
        }
    }
}
