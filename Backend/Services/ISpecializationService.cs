using Backend.Models;
using Backend.Models.DTOs;

namespace Backend.Services
{
    /// <summary>
    /// Service interface for Specialization business logic operations
    /// </summary>
    public interface ISpecializationService
    {
        /// <summary>
        /// Gets all specializations
        /// </summary>
        /// <returns>List of specializations</returns>
        Task<ApiResponseDto<IEnumerable<SpecializationResponseDto>>> GetAllSpecializationsAsync();

        /// <summary>
        /// Gets active specializations only
        /// </summary>
        /// <returns>List of active specializations</returns>
        Task<ApiResponseDto<IEnumerable<SpecializationResponseDto>>> GetActiveSpecializationsAsync();

        /// <summary>
        /// Gets specialization by ID
        /// </summary>
        /// <param name="id">Specialization ID</param>
        /// <returns>Specialization details</returns>
        Task<ApiResponseDto<SpecializationResponseDto>> GetSpecializationByIdAsync(int id);

        /// <summary>
        /// Creates a new specialization
        /// </summary>
        /// <param name="createDto">Specialization creation data</param>
        /// <returns>Created specialization</returns>
        Task<ApiResponseDto<SpecializationResponseDto>> CreateSpecializationAsync(CreateSpecializationDto createDto);

        /// <summary>
        /// Updates an existing specialization
        /// </summary>
        /// <param name="updateDto">Specialization update data</param>
        /// <returns>Updated specialization</returns>
        Task<ApiResponseDto<SpecializationResponseDto>> UpdateSpecializationAsync(UpdateSpecializationDto updateDto);

        /// <summary>
        /// Deletes a specialization
        /// </summary>
        /// <param name="id">Specialization ID</param>
        /// <returns>Success status</returns>
        Task<ApiResponseDto<bool>> DeleteSpecializationAsync(int id);

        /// <summary>
        /// Gets specializations with doctor counts
        /// </summary>
        /// <returns>Specializations with statistics</returns>
        Task<ApiResponseDto<IEnumerable<dynamic>>> GetSpecializationsWithStatsAsync();
    }
}
