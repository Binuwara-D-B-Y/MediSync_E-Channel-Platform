using Backend.Models;
using Backend.Models.DTOs;

namespace Backend.Repositories
{
    /// <summary>
    /// Repository interface for Doctor entity operations
    /// </summary>
    public interface IDoctorRepository : IBaseRepository<Doctor, int>
    {
        /// <summary>
        /// Gets all active doctors
        /// </summary>
        /// <returns>List of active doctors</returns>
        Task<IEnumerable<Doctor>> GetActiveDoctorsAsync();

        /// <summary>
        /// Gets doctors by specialization
        /// </summary>
        /// <param name="specializationId">Specialization ID</param>
        /// <returns>List of doctors</returns>
        Task<IEnumerable<Doctor>> GetDoctorsBySpecializationAsync(int specializationId);

        /// <summary>
        /// Searches doctors by name, specialization, or other criteria
        /// </summary>
        /// <param name="searchTerm">Search term</param>
        /// <param name="specializationId">Optional specialization filter</param>
        /// <returns>List of matching doctors</returns>
        Task<IEnumerable<Doctor>> SearchDoctorsAsync(string? searchTerm, int? specializationId = null);

        /// <summary>
        /// Gets doctor with specialization details
        /// </summary>
        /// <param name="doctorId">Doctor ID</param>
        /// <returns>Doctor with specialization info</returns>
        Task<DoctorResponseDto?> GetDoctorWithSpecializationAsync(int doctorId);

        /// <summary>
        /// Gets all doctors with their specialization details
        /// </summary>
        /// <returns>List of doctors with specialization info</returns>
        Task<IEnumerable<DoctorResponseDto>> GetAllDoctorsWithSpecializationAsync();

        /// <summary>
        /// Checks if email already exists
        /// </summary>
        /// <param name="email">Email address</param>
        /// <param name="excludeId">ID to exclude from check (for updates)</param>
        /// <returns>True if email exists</returns>
        Task<bool> EmailExistsAsync(string email, int? excludeId = null);

        /// <summary>
        /// Gets doctors with their schedule counts
        /// </summary>
        /// <returns>List of doctors with schedule statistics</returns>
        Task<IEnumerable<dynamic>> GetDoctorsWithScheduleStatsAsync();
    }
}
