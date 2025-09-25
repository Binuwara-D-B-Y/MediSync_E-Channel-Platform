using Backend.Models;
using Backend.Models.DTOs;
using Backend.Repositories;

namespace Backend.Services
{
    /// <summary>
    /// Service implementation for Specialization business logic operations
    /// </summary>
    public class SpecializationService : ISpecializationService
    {
        private readonly ISpecializationRepository _specializationRepository;

        public SpecializationService(ISpecializationRepository specializationRepository)
        {
            _specializationRepository = specializationRepository;
        }

        public async Task<ApiResponseDto<IEnumerable<SpecializationResponseDto>>> GetAllSpecializationsAsync()
        {
            try
            {
                var specializations = await _specializationRepository.GetAllAsync();
                var specializationDtos = specializations.Select(MapToResponseDto);

                return new ApiResponseDto<IEnumerable<SpecializationResponseDto>>
                {
                    Success = true,
                    Data = specializationDtos,
                    Message = "Specializations retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<IEnumerable<SpecializationResponseDto>>
                {
                    Success = false,
                    Message = $"Error retrieving specializations: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDto<IEnumerable<SpecializationResponseDto>>> GetActiveSpecializationsAsync()
        {
            try
            {
                var specializations = await _specializationRepository.GetActiveSpecializationsAsync();
                var specializationDtos = specializations.Select(MapToResponseDto);

                return new ApiResponseDto<IEnumerable<SpecializationResponseDto>>
                {
                    Success = true,
                    Data = specializationDtos,
                    Message = "Active specializations retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<IEnumerable<SpecializationResponseDto>>
                {
                    Success = false,
                    Message = $"Error retrieving active specializations: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDto<SpecializationResponseDto>> GetSpecializationByIdAsync(int id)
        {
            try
            {
                var specialization = await _specializationRepository.GetByIdAsync(id);
                if (specialization == null)
                {
                    return new ApiResponseDto<SpecializationResponseDto>
                    {
                        Success = false,
                        Message = "Specialization not found"
                    };
                }

                return new ApiResponseDto<SpecializationResponseDto>
                {
                    Success = true,
                    Data = MapToResponseDto(specialization),
                    Message = "Specialization retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<SpecializationResponseDto>
                {
                    Success = false,
                    Message = $"Error retrieving specialization: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDto<SpecializationResponseDto>> CreateSpecializationAsync(CreateSpecializationDto createDto)
        {
            try
            {
                // Check if name already exists
                if (await _specializationRepository.NameExistsAsync(createDto.Name))
                {
                    return new ApiResponseDto<SpecializationResponseDto>
                    {
                        Success = false,
                        Message = "Specialization name already exists"
                    };
                }

                var specialization = new Specialization
                {
                    Name = createDto.Name,
                    Description = createDto.Description,
                    IsActive = true,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                var createdSpecialization = await _specializationRepository.CreateAsync(specialization);

                return new ApiResponseDto<SpecializationResponseDto>
                {
                    Success = true,
                    Data = MapToResponseDto(createdSpecialization),
                    Message = "Specialization created successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<SpecializationResponseDto>
                {
                    Success = false,
                    Message = $"Error creating specialization: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDto<SpecializationResponseDto>> UpdateSpecializationAsync(UpdateSpecializationDto updateDto)
        {
            try
            {
                // Check if specialization exists
                if (!await _specializationRepository.ExistsAsync(updateDto.SpecializationId))
                {
                    return new ApiResponseDto<SpecializationResponseDto>
                    {
                        Success = false,
                        Message = "Specialization not found"
                    };
                }

                // Check if name already exists (excluding current specialization)
                if (await _specializationRepository.NameExistsAsync(updateDto.Name, updateDto.SpecializationId))
                {
                    return new ApiResponseDto<SpecializationResponseDto>
                    {
                        Success = false,
                        Message = "Specialization name already exists"
                    };
                }

                var existingSpecialization = await _specializationRepository.GetByIdAsync(updateDto.SpecializationId);
                if (existingSpecialization == null)
                {
                    return new ApiResponseDto<SpecializationResponseDto>
                    {
                        Success = false,
                        Message = "Specialization not found"
                    };
                }

                // Update specialization properties
                existingSpecialization.Name = updateDto.Name;
                existingSpecialization.Description = updateDto.Description;
                existingSpecialization.IsActive = updateDto.IsActive;
                existingSpecialization.UpdatedAt = DateTime.Now;

                var updatedSpecialization = await _specializationRepository.UpdateAsync(existingSpecialization);

                return new ApiResponseDto<SpecializationResponseDto>
                {
                    Success = true,
                    Data = MapToResponseDto(updatedSpecialization),
                    Message = "Specialization updated successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<SpecializationResponseDto>
                {
                    Success = false,
                    Message = $"Error updating specialization: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDto<bool>> DeleteSpecializationAsync(int id)
        {
            try
            {
                if (!await _specializationRepository.ExistsAsync(id))
                {
                    return new ApiResponseDto<bool>
                    {
                        Success = false,
                        Message = "Specialization not found"
                    };
                }

                var deleted = await _specializationRepository.DeleteAsync(id);
                return new ApiResponseDto<bool>
                {
                    Success = deleted,
                    Data = deleted,
                    Message = deleted ? "Specialization deleted successfully" : "Failed to delete specialization"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<bool>
                {
                    Success = false,
                    Message = $"Error deleting specialization: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDto<IEnumerable<dynamic>>> GetSpecializationsWithStatsAsync()
        {
            try
            {
                var stats = await _specializationRepository.GetSpecializationsWithDoctorCountAsync();
                return new ApiResponseDto<IEnumerable<dynamic>>
                {
                    Success = true,
                    Data = stats,
                    Message = "Specialization statistics retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<IEnumerable<dynamic>>
                {
                    Success = false,
                    Message = $"Error retrieving specialization statistics: {ex.Message}"
                };
            }
        }

        private static SpecializationResponseDto MapToResponseDto(Specialization specialization)
        {
            return new SpecializationResponseDto
            {
                SpecializationId = specialization.SpecializationId,
                Name = specialization.Name,
                Description = specialization.Description,
                IsActive = specialization.IsActive,
                CreatedAt = specialization.CreatedAt,
                UpdatedAt = specialization.UpdatedAt
            };
        }
    }
}
