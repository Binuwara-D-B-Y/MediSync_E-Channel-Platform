using Backend.Models;
using Backend.Models.DTOs;
using Backend.Repositories;

namespace Backend.Services
{
    /// <summary>
    /// Service implementation for Doctor business logic operations
    /// </summary>
    public class DoctorServiceImpl : IDoctorService
    {
        private readonly IDoctorRepository _doctorRepository;

        public DoctorServiceImpl(IDoctorRepository doctorRepository)
        {
            _doctorRepository = doctorRepository;
        }

        public async Task<ApiResponseDto<IEnumerable<DoctorResponseDto>>> GetAllDoctorsAsync()
        {
            try
            {
                var doctors = await _doctorRepository.GetActiveDoctorsAsync();
                var doctorDtos = doctors.Select(d => new DoctorResponseDto
                {
                    DoctorId = d.DoctorId,
                    FullName = d.FullName,
                    Specialization = d.Specialization,
                    ContactNumber = d.ContactNumber,
                    Email = d.Email,
                    Qualifications = d.Qualifications,
                    Details = d.Details,
                    HospitalName = d.HospitalName,
                    Address = d.Address,
                    IsActive = d.IsActive,
                    CreatedAt = d.CreatedAt,
                    UpdatedAt = d.UpdatedAt
                });
                return new ApiResponseDto<IEnumerable<DoctorResponseDto>>
                {
                    Success = true,
                    Data = doctorDtos,
                    Message = "Doctors retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<IEnumerable<DoctorResponseDto>>
                {
                    Success = false,
                    Message = $"Error retrieving doctors: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDto<IEnumerable<DoctorResponseDto>>> GetActiveDoctorsAsync()
        {
            try
            {
                var doctors = await _doctorRepository.GetActiveDoctorsAsync();
                var doctorDtos = doctors.Select(d => new DoctorResponseDto
                {
                    DoctorId = d.DoctorId,
                    FullName = d.FullName,
                    Specialization = d.Specialization,
                    ContactNumber = d.ContactNumber,
                    Email = d.Email,
                    Qualifications = d.Qualifications,
                    Details = d.Details,
                    HospitalName = d.HospitalName,
                    Address = d.Address,
                    IsActive = d.IsActive,
                    CreatedAt = d.CreatedAt,
                    UpdatedAt = d.UpdatedAt
                });

                return new ApiResponseDto<IEnumerable<DoctorResponseDto>>
                {
                    Success = true,
                    Data = doctorDtos,
                    Message = "Active doctors retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<IEnumerable<DoctorResponseDto>>
                {
                    Success = false,
                    Message = $"Error retrieving active doctors: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDto<DoctorResponseDto>> GetDoctorByIdAsync(int id)
        {
            try
            {
                var doctor = await _doctorRepository.GetDoctorWithSpecializationAsync(id);
                if (doctor == null)
                {
                    return new ApiResponseDto<DoctorResponseDto>
                    {
                        Success = false,
                        Message = "Doctor not found"
                    };
                }

                return new ApiResponseDto<DoctorResponseDto>
                {
                    Success = true,
                    Data = doctor,
                    Message = "Doctor retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<DoctorResponseDto>
                {
                    Success = false,
                    Message = $"Error retrieving doctor: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDto<DoctorResponseDto>> CreateDoctorAsync(CreateDoctorDto createDto)
        {
            try
            {
                // Check if email already exists
                if (await _doctorRepository.EmailExistsAsync(createDto.Email))
                {
                    return new ApiResponseDto<DoctorResponseDto>
                    {
                        Success = false,
                        Message = "Email address already exists"
                    };
                }

                var doctor = new Doctor
                {
                    FullName = createDto.FullName,
                    Specialization = createDto.Specialization,
                    ContactNumber = createDto.ContactNumber,
                    Email = createDto.Email,
                    Qualifications = createDto.Qualifications,
                    Details = createDto.Details,
                    HospitalName = createDto.HospitalName,
                    Address = createDto.Address,
                    IsActive = true,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                var createdDoctor = await _doctorRepository.CreateAsync(doctor);
                var doctorResponse = new DoctorResponseDto
                {
                    DoctorId = createdDoctor.DoctorId,
                    FullName = createdDoctor.FullName,
                    Specialization = createdDoctor.Specialization,
                    ContactNumber = createdDoctor.ContactNumber,
                    Email = createdDoctor.Email,
                    Qualifications = createdDoctor.Qualifications,
                    Details = createdDoctor.Details,
                    HospitalName = createdDoctor.HospitalName,
                    Address = createdDoctor.Address,
                    IsActive = createdDoctor.IsActive,
                    CreatedAt = createdDoctor.CreatedAt,
                    UpdatedAt = createdDoctor.UpdatedAt
                };

                return new ApiResponseDto<DoctorResponseDto>
                {
                    Success = true,
                    Data = doctorResponse,
                    Message = "Doctor created successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<DoctorResponseDto>
                {
                    Success = false,
                    Message = $"Error creating doctor: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDto<DoctorResponseDto>> UpdateDoctorAsync(UpdateDoctorDto updateDto)
        {
            try
            {
                // Check if doctor exists
                if (!await _doctorRepository.ExistsAsync(updateDto.DoctorId))
                {
                    return new ApiResponseDto<DoctorResponseDto>
                    {
                        Success = false,
                        Message = "Doctor not found"
                    };
                }

                // Check if email already exists (excluding current doctor)
                if (await _doctorRepository.EmailExistsAsync(updateDto.Email, updateDto.DoctorId))
                {
                    return new ApiResponseDto<DoctorResponseDto>
                    {
                        Success = false,
                        Message = "Email address already exists"
                    };
                }

                var existingDoctor = await _doctorRepository.GetByIdAsync(updateDto.DoctorId);
                if (existingDoctor == null)
                {
                    return new ApiResponseDto<DoctorResponseDto>
                    {
                        Success = false,
                        Message = "Doctor not found"
                    };
                }

                // Update doctor properties
                existingDoctor.FullName = updateDto.FullName;
                existingDoctor.Specialization = updateDto.Specialization;
                existingDoctor.ContactNumber = updateDto.ContactNumber;
                existingDoctor.Email = updateDto.Email;
                existingDoctor.Qualifications = updateDto.Qualifications;
                existingDoctor.Details = updateDto.Details;
                existingDoctor.HospitalName = updateDto.HospitalName;
                existingDoctor.Address = updateDto.Address;
                existingDoctor.IsActive = updateDto.IsActive;
                existingDoctor.UpdatedAt = DateTime.Now;

                await _doctorRepository.UpdateAsync(existingDoctor);
                var updatedDoctor = await _doctorRepository.GetDoctorWithSpecializationAsync(updateDto.DoctorId);

                return new ApiResponseDto<DoctorResponseDto>
                {
                    Success = true,
                    Data = updatedDoctor,
                    Message = "Doctor updated successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<DoctorResponseDto>
                {
                    Success = false,
                    Message = $"Error updating doctor: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDto<bool>> DeleteDoctorAsync(int id)
        {
            try
            {
                if (!await _doctorRepository.ExistsAsync(id))
                {
                    return new ApiResponseDto<bool>
                    {
                        Success = false,
                        Message = "Doctor not found"
                    };
                }

                var deleted = await _doctorRepository.DeleteAsync(id);
                return new ApiResponseDto<bool>
                {
                    Success = deleted,
                    Data = deleted,
                    Message = deleted ? "Doctor deleted successfully" : "Failed to delete doctor"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<bool>
                {
                    Success = false,
                    Message = $"Error deleting doctor: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDto<IEnumerable<DoctorResponseDto>>> SearchDoctorsAsync(string? searchTerm, string? specialization = null)
        {
            try
            {
                var doctors = await _doctorRepository.SearchDoctorsAsync(searchTerm, specialization);
                var doctorDtos = doctors.Select(d => new DoctorResponseDto
                {
                    DoctorId = d.DoctorId,
                    FullName = d.FullName,
                    Specialization = d.Specialization,
                    ContactNumber = d.ContactNumber,
                    Email = d.Email,
                    Qualifications = d.Qualifications,
                    Details = d.Details,
                    HospitalName = d.HospitalName,
                    Address = d.Address,
                    IsActive = d.IsActive,
                    CreatedAt = d.CreatedAt,
                    UpdatedAt = d.UpdatedAt
                });

                return new ApiResponseDto<IEnumerable<DoctorResponseDto>>
                {
                    Success = true,
                    Data = doctorDtos,
                    Message = "Search completed successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<IEnumerable<DoctorResponseDto>>
                {
                    Success = false,
                    Message = $"Error searching doctors: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDto<IEnumerable<DoctorResponseDto>>> GetDoctorsBySpecializationAsync(string specialization)
        {
            try
            {
                var doctors = await _doctorRepository.GetDoctorsBySpecializationAsync(specialization);
                var doctorDtos = doctors.Select(d => new DoctorResponseDto
                {
                    DoctorId = d.DoctorId,
                    FullName = d.FullName,
                    Specialization = d.Specialization,
                    ContactNumber = d.ContactNumber,
                    Email = d.Email,
                    Qualifications = d.Qualifications,
                    Details = d.Details,
                    HospitalName = d.HospitalName,
                    Address = d.Address,
                    IsActive = d.IsActive,
                    CreatedAt = d.CreatedAt,
                    UpdatedAt = d.UpdatedAt
                });

                return new ApiResponseDto<IEnumerable<DoctorResponseDto>>
                {
                    Success = true,
                    Data = doctorDtos,
                    Message = "Doctors retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<IEnumerable<DoctorResponseDto>>
                {
                    Success = false,
                    Message = $"Error retrieving doctors by specialization: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDto<IEnumerable<dynamic>>> GetDoctorsWithStatsAsync()
        {
            try
            {
                var stats = await _doctorRepository.GetDoctorsWithScheduleStatsAsync();
                return new ApiResponseDto<IEnumerable<dynamic>>
                {
                    Success = true,
                    Data = stats,
                    Message = "Doctor statistics retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto<IEnumerable<dynamic>>
                {
                    Success = false,
                    Message = $"Error retrieving doctor statistics: {ex.Message}"
                };
            }
        }
    }
}