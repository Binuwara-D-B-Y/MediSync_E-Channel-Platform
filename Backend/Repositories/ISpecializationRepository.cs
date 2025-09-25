using Backend.Models;
using Backend.Models.DTOs;

namespace Backend.Repositories
{
    /// <summary>
    /// Repository interface for Specialization entity operations
    /// </summary>
    public interface ISpecializationRepository : IBaseRepository<Specialization, int>
    {
        /// <summary>
        /// Gets all active specializations
        /// </summary>
        /// <returns>List of active specializations</returns>
        Task<IEnumerable<Specialization>> GetActiveSpecializationsAsync();

        /// <summary>
        /// Gets specialization by name
        /// </summary>
        /// <param name="name">Specialization name</param>
        /// <returns>Specialization or null if not found</returns>
        Task<Specialization?> GetByNameAsync(string name);

        /// <summary>
        /// Checks if specialization name already exists
        /// </summary>
        /// <param name="name">Specialization name</param>
        /// <param name="excludeId">ID to exclude from check (for updates)</param>
        /// <returns>True if name exists</returns>
        Task<bool> NameExistsAsync(string name, int? excludeId = null);

        /// <summary>
        /// Gets specializations with doctor count
        /// </summary>
        /// <returns>List of specializations with doctor counts</returns>
        Task<IEnumerable<dynamic>> GetSpecializationsWithDoctorCountAsync();
    }
}
