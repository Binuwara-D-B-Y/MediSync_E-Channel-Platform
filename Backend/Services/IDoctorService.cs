using Backend.Models;
using Backend.Models.DTOs;

namespace Backend.Services
{
    /// <summary>
    /// Service interface for Doctor business logic operations
    /// </summary>
    public interface IDoctorService
    {
        /// <summary>
        /// Gets all doctors with their specialization details
        /// </summary>
        /// <returns>List of doctors</returns>
        Task<ApiResponseDto<IEnumerable<DoctorResponseDto>>> GetAllDoctorsAsync();

        /// <summary>
        /// Gets active doctors only
        /// </summary>
        /// <returns>List of active doctors</returns>
        Task<ApiResponseDto<IEnumerable<DoctorResponseDto>>> GetActiveDoctorsAsync();

        /// <summary>
        /// Gets doctor by ID
        /// </summary>
        /// <param name="id">Doctor ID</param>
        /// <returns>Doctor details</returns>
        Task<ApiResponseDto<DoctorResponseDto>> GetDoctorByIdAsync(int id);

        /// <summary>
        /// Creates a new doctor
        /// </summary>
        /// <param name="createDto">Doctor creation data</param>
        /// <returns>Created doctor</returns>
        Task<ApiResponseDto<DoctorResponseDto>> CreateDoctorAsync(CreateDoctorDto createDto);

        /// <summary>
        /// Updates an existing doctor
        /// </summary>
        /// <param name="updateDto">Doctor update data</param>
        /// <returns>Updated doctor</returns>
        Task<ApiResponseDto<DoctorResponseDto>> UpdateDoctorAsync(UpdateDoctorDto updateDto);

        /// <summary>
        /// Deletes a doctor
        /// </summary>
        /// <param name="id">Doctor ID</param>
        /// <returns>Success status</returns>
        Task<ApiResponseDto<bool>> DeleteDoctorAsync(int id);

        /// <summary>
        /// Searches doctors by criteria
        /// </summary>
        /// <param name="searchTerm">Search term</param>
        /// <param name="specialization">Optional specialization filter</param>
        /// <returns>Matching doctors</returns>
        Task<ApiResponseDto<IEnumerable<DoctorResponseDto>>> SearchDoctorsAsync(string? searchTerm, string? specialization = null);

        /// <summary>
        /// Gets doctors by specialization
        /// </summary>
        /// <param name="specialization">Specialization name</param>
        /// <returns>Doctors in specialization</returns>
        Task<ApiResponseDto<IEnumerable<DoctorResponseDto>>> GetDoctorsBySpecializationAsync(string specialization);

        /// <summary>
        /// Gets doctors with schedule statistics
        /// </summary>
        /// <returns>Doctors with stats</returns>
        Task<ApiResponseDto<IEnumerable<dynamic>>> GetDoctorsWithStatsAsync();
    }
}
