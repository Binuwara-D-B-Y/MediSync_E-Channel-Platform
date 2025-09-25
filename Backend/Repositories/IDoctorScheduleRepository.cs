using Backend.Models;
using Backend.Models.DTOs;

namespace Backend.Repositories
{
    /// <summary>
    /// Repository interface for DoctorSchedule entity operations
    /// </summary>
    public interface IDoctorScheduleRepository : IBaseRepository<DoctorSchedule, int>
    {
        /// <summary>
        /// Gets all schedules for a specific doctor
        /// </summary>
        /// <param name="doctorId">Doctor ID</param>
        /// <returns>List of doctor schedules</returns>
        Task<IEnumerable<DoctorSchedule>> GetSchedulesByDoctorAsync(int doctorId);

        /// <summary>
        /// Gets schedules by date range
        /// </summary>
        /// <param name="startDate">Start date</param>
        /// <param name="endDate">End date</param>
        /// <returns>List of schedules in date range</returns>
        Task<IEnumerable<DoctorSchedule>> GetSchedulesByDateRangeAsync(DateTime startDate, DateTime endDate);

        /// <summary>
        /// Gets schedules for a specific doctor and date
        /// </summary>
        /// <param name="doctorId">Doctor ID</param>
        /// <param name="date">Schedule date</param>
        /// <returns>List of schedules for the date</returns>
        Task<IEnumerable<DoctorSchedule>> GetSchedulesByDoctorAndDateAsync(int doctorId, DateTime date);

        /// <summary>
        /// Gets available schedules (with available slots)
        /// </summary>
        /// <param name="doctorId">Optional doctor filter</param>
        /// <param name="date">Optional date filter</param>
        /// <returns>List of available schedules</returns>
        Task<IEnumerable<DoctorSchedule>> GetAvailableSchedulesAsync(int? doctorId = null, DateTime? date = null);

        /// <summary>
        /// Gets detailed schedule information with doctor and specialization
        /// </summary>
        /// <param name="scheduleId">Schedule ID</param>
        /// <returns>Detailed schedule information</returns>
        Task<DoctorScheduleResponseDto?> GetScheduleWithDetailsAsync(int scheduleId);

        /// <summary>
        /// Gets all schedules with doctor and specialization details
        /// </summary>
        /// <returns>List of detailed schedule information</returns>
        Task<IEnumerable<DoctorScheduleResponseDto>> GetAllSchedulesWithDetailsAsync();

        /// <summary>
        /// Checks for schedule conflicts for a doctor
        /// </summary>
        /// <param name="doctorId">Doctor ID</param>
        /// <param name="date">Schedule date</param>
        /// <param name="startTime">Start time</param>
        /// <param name="endTime">End time</param>
        /// <param name="excludeScheduleId">Schedule ID to exclude from conflict check</param>
        /// <returns>True if conflict exists</returns>
        Task<bool> HasScheduleConflictAsync(int doctorId, DateTime date, TimeSpan startTime, TimeSpan endTime, int? excludeScheduleId = null);

        /// <summary>
        /// Updates booked slots count for a schedule
        /// </summary>
        /// <param name="scheduleId">Schedule ID</param>
        /// <param name="increment">Number to increment (can be negative for decrement)</param>
        /// <returns>True if updated successfully</returns>
        Task<bool> UpdateBookedSlotsAsync(int scheduleId, int increment);

        /// <summary>
        /// Gets upcoming schedules for a doctor
        /// </summary>
        /// <param name="doctorId">Doctor ID</param>
        /// <param name="days">Number of days ahead to look</param>
        /// <returns>List of upcoming schedules</returns>
        Task<IEnumerable<DoctorSchedule>> GetUpcomingSchedulesAsync(int doctorId, int days = 30);
    }
}
