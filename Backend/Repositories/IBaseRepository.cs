namespace Backend.Repositories
{
    /// <summary>
    /// Base repository interface for common CRUD operations
    /// </summary>
    /// <typeparam name="T">Entity type</typeparam>
    /// <typeparam name="TKey">Primary key type</typeparam>
    public interface IBaseRepository<T, TKey> where T : class
    {
        /// <summary>
        /// Gets all entities
        /// </summary>
        /// <returns>List of entities</returns>
        Task<IEnumerable<T>> GetAllAsync();

        /// <summary>
        /// Gets entity by ID
        /// </summary>
        /// <param name="id">Entity ID</param>
        /// <returns>Entity or null if not found</returns>
        Task<T?> GetByIdAsync(TKey id);

        /// <summary>
        /// Creates a new entity
        /// </summary>
        /// <param name="entity">Entity to create</param>
        /// <returns>Created entity with ID</returns>
        Task<T> CreateAsync(T entity);

        /// <summary>
        /// Updates an existing entity
        /// </summary>
        /// <param name="entity">Entity to update</param>
        /// <returns>Updated entity</returns>
        Task<T> UpdateAsync(T entity);

        /// <summary>
        /// Deletes an entity by ID
        /// </summary>
        /// <param name="id">Entity ID</param>
        /// <returns>True if deleted successfully</returns>
        Task<bool> DeleteAsync(TKey id);

        /// <summary>
        /// Checks if entity exists by ID
        /// </summary>
        /// <param name="id">Entity ID</param>
        /// <returns>True if exists</returns>
        Task<bool> ExistsAsync(TKey id);
    }
}
