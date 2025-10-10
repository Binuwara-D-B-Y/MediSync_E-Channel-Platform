using MySql.Data.MySqlClient;

namespace Backend.Services
{
    /// <summary>
    /// Interface for database connection management
    /// </summary>
    public interface IDatabaseConnectionService
    {
        /// <summary>
        /// Creates and returns a new MySQL connection
        /// </summary>
        /// <returns>MySqlConnection instance</returns>
        MySqlConnection CreateConnection();

        /// <summary>
        /// Tests the database connection
        /// </summary>
        /// <returns>True if connection is successful, false otherwise</returns>
        Task<bool> TestConnectionAsync();
    }
}
