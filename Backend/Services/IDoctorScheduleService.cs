using Backend.Models.DTOs;
using Backend.Models;

namespace Backend.Services
{
    /// <summary>
    /// Service interface for DoctorSchedule business logic operations
    /// </summary>
    public interface IDoctorScheduleService
    {
        Task<ApiResponseDto<IEnumerable<DoctorScheduleResponseDto>>> GetAllSchedulesAsync(int? doctorId = null, DateTime? date = null);
        Task<ApiResponseDto<DoctorScheduleResponseDto>> GetScheduleByIdAsync(int scheduleId);
        Task<ApiResponseDto<DoctorScheduleResponseDto>> CreateScheduleAsync(CreateDoctorScheduleDto createDto);
        Task<ApiResponseDto<DoctorScheduleResponseDto>> UpdateScheduleAsync(UpdateDoctorScheduleDto updateDto);
        Task<ApiResponseDto<bool>> DeleteScheduleAsync(int scheduleId);
        Task<ApiResponseDto<IEnumerable<DoctorScheduleResponseDto>>> GetUpcomingSchedulesAsync(int doctorId, int days = 30);
    }
}
