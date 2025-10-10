using MySql.Data.MySqlClient;

namespace Backend.Services
{
    /// <summary>
    /// Service for managing MySQL database connections using ADO.NET
    /// </summary>
    public class DatabaseConnectionService : IDatabaseConnectionService
    {
        private readonly string _connectionString;

        public DatabaseConnectionService(IConfiguration configuration)
        {
            var rawConnectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? throw new ArgumentNullException(nameof(configuration), "Database connection string not found");
            
            var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");
            if (!string.IsNullOrWhiteSpace(dbPassword))
            {
                _connectionString = rawConnectionString.Replace("${DB_PASSWORD}", dbPassword);
            }
            else
            {
                _connectionString = rawConnectionString;
            }
        }

        /// <summary>
        /// Creates and returns a new MySQL connection
        /// </summary>
        /// <returns>MySqlConnection instance</returns>
        public MySqlConnection CreateConnection()
        {
            return new MySqlConnection(_connectionString);
        }

        /// <summary>
        /// Tests the database connection asynchronously
        /// </summary>
        /// <returns>True if connection is successful, false otherwise</returns>
        public async Task<bool> TestConnectionAsync()
        {
            try
            {
                using var connection = CreateConnection();
                await connection.OpenAsync();
                return connection.State == System.Data.ConnectionState.Open;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
