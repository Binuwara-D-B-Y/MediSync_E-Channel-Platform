using Backend.Models;
using Backend.Models.DTOs;
using Backend.Repositories;

namespace Backend.Services
{
    /// <summary>
    /// Service implementation for DoctorSchedule business logic operations
    /// </summary>
    public class DoctorScheduleService : IDoctorScheduleService
    {
        private readonly IDoctorScheduleRepository _scheduleRepository;
        private readonly IDoctorRepository _doctorRepository;

        public DoctorScheduleService(IDoctorScheduleRepository scheduleRepository, IDoctorRepository doctorRepository)
        {
            _scheduleRepository = scheduleRepository;
            _doctorRepository = doctorRepository;
        }

        public async Task<ApiResponseDto<IEnumerable<DoctorScheduleResponseDto>>> GetAllSchedulesAsync(int? doctorId = null, DateTime? date = null)
        {
            try
            {
                IEnumerable<DoctorScheduleResponseDto> result;
                if (doctorId.HasValue || date.HasValue)
                {
                    var schedules = await _scheduleRepository.GetAvailableSchedulesAsync(doctorId, date);
                    result = schedules.Select(MapEntityToResponseDtoBasic);
                }
                else
                {
                    result = await _scheduleRepository.GetAllSchedulesWithDetailsAsync();
                }

                return new ApiResponseDto<IEnumerable<DoctorScheduleResponseDto>>
                {
                    Success = true,
                    Data = result,
                    Message = "Schedules retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<IEnumerable<DoctorScheduleResponseDto>>
                {
                    Success = false,
                    Message = $"Error retrieving schedules: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDto<DoctorScheduleResponseDto>> GetScheduleByIdAsync(int scheduleId)
        {
            try
            {
                var schedule = await _scheduleRepository.GetScheduleWithDetailsAsync(scheduleId);
                if (schedule == null)
                {
                    return new ApiResponseDto<DoctorScheduleResponseDto>
                    {
                        Success = false,
                        Message = "Schedule not found"
                    };
                }

                return new ApiResponseDto<DoctorScheduleResponseDto>
                {
                    Success = true,
                    Data = schedule,
                    Message = "Schedule retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<DoctorScheduleResponseDto>
                {
                    Success = false,
                    Message = $"Error retrieving schedule: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDto<DoctorScheduleResponseDto>> CreateScheduleAsync(CreateDoctorScheduleDto createDto)
        {
            try
            {
                // Validate doctor exists
                if (!await _doctorRepository.ExistsAsync(createDto.DoctorId))
                {
                    return new ApiResponseDto<DoctorScheduleResponseDto>
                    {
                        Success = false,
                        Message = "Invalid doctor ID"
                    };
                }

                // Validate times
                if (createDto.EndTime <= createDto.StartTime)
                {
                    return new ApiResponseDto<DoctorScheduleResponseDto>
                    {
                        Success = false,
                        Message = "End time must be after start time"
                    };
                }

                // Conflict check
                if (await _scheduleRepository.HasScheduleConflictAsync(createDto.DoctorId, createDto.ScheduleDate, createDto.StartTime, createDto.EndTime))
                {
                    return new ApiResponseDto<DoctorScheduleResponseDto>
                    {
                        Success = false,
                        Message = "Schedule conflicts with an existing one"
                    };
                }

                var totalSlots = CalculateTotalSlots(createDto.StartTime, createDto.EndTime, createDto.SlotDurationMinutes, createDto.MaxPatientsPerSlot);

                var entity = new DoctorSchedule
                {
                    DoctorId = createDto.DoctorId,
                    ScheduleDate = createDto.ScheduleDate.Date,
                    StartTime = createDto.StartTime,
                    EndTime = createDto.EndTime,
                    SlotDurationMinutes = createDto.SlotDurationMinutes,
                    MaxPatientsPerSlot = createDto.MaxPatientsPerSlot,
                    TotalSlots = totalSlots,
                    BookedSlots = 0,
                    IsActive = true,
                    Notes = createDto.Notes,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                var created = await _scheduleRepository.CreateAsync(entity);
                var response = await _scheduleRepository.GetScheduleWithDetailsAsync(created.ScheduleId);

                return new ApiResponseDto<DoctorScheduleResponseDto>
                {
                    Success = true,
                    Data = response,
                    Message = "Schedule created successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<DoctorScheduleResponseDto>
                {
                    Success = false,
                    Message = $"Error creating schedule: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDto<DoctorScheduleResponseDto>> UpdateScheduleAsync(UpdateDoctorScheduleDto updateDto)
        {
            try
            {
                // Check exists
                if (!await _scheduleRepository.ExistsAsync(updateDto.ScheduleId))
                {
                    return new ApiResponseDto<DoctorScheduleResponseDto>
                    {
                        Success = false,
                        Message = "Schedule not found"
                    };
                }

                if (updateDto.EndTime <= updateDto.StartTime)
                {
                    return new ApiResponseDto<DoctorScheduleResponseDto>
                    {
                        Success = false,
                        Message = "End time must be after start time"
                    };
                }

                // Load current to preserve DoctorId, BookedSlots
                var current = await _scheduleRepository.GetByIdAsync(updateDto.ScheduleId);
                if (current == null)
                {
                    return new ApiResponseDto<DoctorScheduleResponseDto>
                    {
                        Success = false,
                        Message = "Schedule not found"
                    };
                }

                // Conflict check excluding current schedule
                if (await _scheduleRepository.HasScheduleConflictAsync(current.DoctorId, updateDto.ScheduleDate, updateDto.StartTime, updateDto.EndTime, updateDto.ScheduleId))
                {
                    return new ApiResponseDto<DoctorScheduleResponseDto>
                    {
                        Success = false,
                        Message = "Schedule conflicts with an existing one"
                    };
                }

                var totalSlots = CalculateTotalSlots(updateDto.StartTime, updateDto.EndTime, updateDto.SlotDurationMinutes, updateDto.MaxPatientsPerSlot);
                if (totalSlots < current.BookedSlots)
                {
                    return new ApiResponseDto<DoctorScheduleResponseDto>
                    {
                        Success = false,
                        Message = "Total slots cannot be less than already booked slots"
                    };
                }

                current.ScheduleDate = updateDto.ScheduleDate.Date;
                current.StartTime = updateDto.StartTime;
                current.EndTime = updateDto.EndTime;
                current.SlotDurationMinutes = updateDto.SlotDurationMinutes;
                current.MaxPatientsPerSlot = updateDto.MaxPatientsPerSlot;
                current.TotalSlots = totalSlots;
                current.IsActive = updateDto.IsActive;
                current.Notes = updateDto.Notes;
                current.UpdatedAt = DateTime.Now;

                await _scheduleRepository.UpdateAsync(current);
                var response = await _scheduleRepository.GetScheduleWithDetailsAsync(updateDto.ScheduleId);

                return new ApiResponseDto<DoctorScheduleResponseDto>
                {
                    Success = true,
                    Data = response,
                    Message = "Schedule updated successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<DoctorScheduleResponseDto>
                {
                    Success = false,
                    Message = $"Error updating schedule: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDto<bool>> DeleteScheduleAsync(int scheduleId)
        {
            try
            {
                if (!await _scheduleRepository.ExistsAsync(scheduleId))
                {
                    return new ApiResponseDto<bool>
                    {
                        Success = false,
                        Message = "Schedule not found"
                    };
                }

                var deleted = await _scheduleRepository.DeleteAsync(scheduleId);
                return new ApiResponseDto<bool>
                {
                    Success = deleted,
                    Data = deleted,
                    Message = deleted ? "Schedule deleted successfully" : "Failed to delete schedule"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<bool>
                {
                    Success = false,
                    Message = $"Error deleting schedule: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDto<IEnumerable<DoctorScheduleResponseDto>>> GetUpcomingSchedulesAsync(int doctorId, int days = 30)
        {
            try
            {
                var schedules = await _scheduleRepository.GetUpcomingSchedulesAsync(doctorId, days);
                var response = schedules.Select(MapEntityToResponseDtoBasic);
                return new ApiResponseDto<IEnumerable<DoctorScheduleResponseDto>>
                {
                    Success = true,
                    Data = response,
                    Message = "Upcoming schedules retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<IEnumerable<DoctorScheduleResponseDto>>
                {
                    Success = false,
                    Message = $"Error retrieving upcoming schedules: {ex.Message}"
                };
            }
        }

        private static int CalculateTotalSlots(TimeSpan start, TimeSpan end, int slotMinutes, int maxPerSlot)
        {
            var totalMinutes = (int)(end - start).TotalMinutes;
            var slotCount = totalMinutes / slotMinutes;
            return Math.Max(0, slotCount * Math.Max(1, maxPerSlot));
        }

        private static DoctorScheduleResponseDto MapEntityToResponseDtoBasic(DoctorSchedule ds)
        {
            var available = Math.Max(0, ds.TotalSlots - ds.BookedSlots);
            return new DoctorScheduleResponseDto
            {
                ScheduleId = ds.ScheduleId,
                DoctorId = ds.DoctorId,
                DoctorName = string.Empty,
                SpecializationName = string.Empty,
                ScheduleDate = ds.ScheduleDate,
                StartTime = ds.StartTime,
                EndTime = ds.EndTime,
                SlotDurationMinutes = ds.SlotDurationMinutes,
                MaxPatientsPerSlot = ds.MaxPatientsPerSlot,
                TotalSlots = ds.TotalSlots,
                BookedSlots = ds.BookedSlots,
                AvailableSlots = available,
                IsActive = ds.IsActive,
                Notes = ds.Notes,
                CreatedAt = ds.CreatedAt,
                UpdatedAt = ds.UpdatedAt
            };
        }
    }
}
