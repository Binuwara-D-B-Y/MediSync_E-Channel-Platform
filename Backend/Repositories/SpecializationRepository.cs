using Backend.Models;
using Backend.Services;
using MySql.Data.MySqlClient;
using System.Data;

namespace Backend.Repositories
{
    /// <summary>
    /// Repository implementation for Specialization entity using ADO.NET and raw SQL
    /// </summary>
    public class SpecializationRepository : ISpecializationRepository
    {
        private readonly IDatabaseConnectionService _connectionService;

        public SpecializationRepository(IDatabaseConnectionService connectionService)
        {
            _connectionService = connectionService;
        }

        public async Task<IEnumerable<Specialization>> GetAllAsync()
        {
            const string sql = @"
                SELECT SpecializationId, Name, Description, IsActive, CreatedAt, UpdatedAt 
                FROM Specializations 
                ORDER BY Name";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            var specializations = new List<Specialization>();
            while (await reader.ReadAsync())
            {
                specializations.Add(MapFromReader(reader));
            }

            return specializations;
        }

        public async Task<IEnumerable<Specialization>> GetActiveSpecializationsAsync()
        {
            const string sql = @"
                SELECT SpecializationId, Name, Description, IsActive, CreatedAt, UpdatedAt 
                FROM Specializations 
                WHERE IsActive = 1 
                ORDER BY Name";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            var specializations = new List<Specialization>();
            while (await reader.ReadAsync())
            {
                specializations.Add(MapFromReader(reader));
            }

            return specializations;
        }

        public async Task<Specialization?> GetByIdAsync(int id)
        {
            const string sql = @"
                SELECT SpecializationId, Name, Description, IsActive, CreatedAt, UpdatedAt 
                FROM Specializations 
                WHERE SpecializationId = @Id";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Id", id);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            return await reader.ReadAsync() ? MapFromReader(reader) : null;
        }

        public async Task<Specialization?> GetByNameAsync(string name)
        {
            const string sql = @"
                SELECT SpecializationId, Name, Description, IsActive, CreatedAt, UpdatedAt 
                FROM Specializations 
                WHERE Name = @Name";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Name", name);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            return await reader.ReadAsync() ? MapFromReader(reader) : null;
        }

        public async Task<Specialization> CreateAsync(Specialization entity)
        {
            const string sql = @"
                INSERT INTO Specializations (Name, Description, IsActive, CreatedAt, UpdatedAt) 
                VALUES (@Name, @Description, @IsActive, @CreatedAt, @UpdatedAt);
                SELECT LAST_INSERT_ID();";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);

            command.Parameters.AddWithValue("@Name", entity.Name);
            command.Parameters.AddWithValue("@Description", entity.Description);
            command.Parameters.AddWithValue("@IsActive", entity.IsActive);
            command.Parameters.AddWithValue("@CreatedAt", entity.CreatedAt);
            command.Parameters.AddWithValue("@UpdatedAt", entity.UpdatedAt);

            await connection.OpenAsync();
            var id = Convert.ToInt32(await command.ExecuteScalarAsync());
            entity.SpecializationId = id;

            return entity;
        }

        public async Task<Specialization> UpdateAsync(Specialization entity)
        {
            const string sql = @"
                UPDATE Specializations 
                SET Name = @Name, Description = @Description, IsActive = @IsActive, UpdatedAt = @UpdatedAt 
                WHERE SpecializationId = @Id";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);

            command.Parameters.AddWithValue("@Id", entity.SpecializationId);
            command.Parameters.AddWithValue("@Name", entity.Name);
            command.Parameters.AddWithValue("@Description", entity.Description);
            command.Parameters.AddWithValue("@IsActive", entity.IsActive);
            command.Parameters.AddWithValue("@UpdatedAt", DateTime.Now);

            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();

            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            const string sql = "DELETE FROM Specializations WHERE SpecializationId = @Id";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Id", id);

            await connection.OpenAsync();
            var rowsAffected = await command.ExecuteNonQueryAsync();

            return rowsAffected > 0;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            const string sql = "SELECT COUNT(1) FROM Specializations WHERE SpecializationId = @Id";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Id", id);

            await connection.OpenAsync();
            var count = Convert.ToInt32(await command.ExecuteScalarAsync());

            return count > 0;
        }

        public async Task<bool> NameExistsAsync(string name, int? excludeId = null)
        {
            var sql = "SELECT COUNT(1) FROM Specializations WHERE Name = @Name";
            if (excludeId.HasValue)
            {
                sql += " AND SpecializationId != @ExcludeId";
            }

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Name", name);
            
            if (excludeId.HasValue)
            {
                command.Parameters.AddWithValue("@ExcludeId", excludeId.Value);
            }

            await connection.OpenAsync();
            var count = Convert.ToInt32(await command.ExecuteScalarAsync());

            return count > 0;
        }

        public async Task<IEnumerable<dynamic>> GetSpecializationsWithDoctorCountAsync()
        {
            const string sql = @"
                SELECT s.SpecializationId, s.Name, s.Description, s.IsActive, 
                       COUNT(d.DoctorId) as DoctorCount
                FROM Specializations s
                LEFT JOIN Doctors d ON s.SpecializationId = d.SpecializationId AND d.IsActive = 1
                GROUP BY s.SpecializationId, s.Name, s.Description, s.IsActive
                ORDER BY s.Name";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            var results = new List<dynamic>();
            while (await reader.ReadAsync())
            {
                results.Add(new
                {
                    SpecializationId = reader.GetInt32(reader.GetOrdinal("SpecializationId")),
                    Name = reader.GetString(reader.GetOrdinal("Name")),
                    Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                    IsActive = reader.GetBoolean(reader.GetOrdinal("IsActive")),
                    DoctorCount = reader.GetInt32(reader.GetOrdinal("DoctorCount"))
                });
            }

            return results;
        }

        private static Specialization MapFromReader(IDataReader reader)
        {
            return new Specialization
            {
                SpecializationId = reader.GetInt32(reader.GetOrdinal("SpecializationId")),
                Name = reader.GetString(reader.GetOrdinal("Name")),
                Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                IsActive = reader.GetBoolean(reader.GetOrdinal("IsActive")),
                CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                UpdatedAt = reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
            };
        }
    }
}
