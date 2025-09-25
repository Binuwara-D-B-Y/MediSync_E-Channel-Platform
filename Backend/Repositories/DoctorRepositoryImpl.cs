using Backend.Models;
using Backend.Models.DTOs;
using Backend.Services;
using MySql.Data.MySqlClient;
using System.Data;

namespace Backend.Repositories
{
    /// <summary>
    /// Repository implementation for Doctor entity using ADO.NET and raw SQL
    /// </summary>
    public class DoctorRepositoryImpl : IDoctorRepository
    {
        private readonly IDatabaseConnectionService _connectionService;

        public DoctorRepositoryImpl(IDatabaseConnectionService connectionService)
        {
            _connectionService = connectionService;
        }

        public async Task<IEnumerable<Doctor>> GetAllAsync()
        {
            const string sql = @"
                SELECT d.DoctorId, d.FullName, d.SpecializationId, s.Name as SpecializationName,
                       d.ContactNumber, d.Email, d.Qualifications, d.ExperienceYears,
                       d.Details, d.HospitalName, d.Address, d.IsActive, d.CreatedAt, d.UpdatedAt
                FROM Doctors d
                LEFT JOIN Specializations s ON d.SpecializationId = s.SpecializationId
                ORDER BY d.FullName";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            var doctors = new List<Doctor>();
            while (await reader.ReadAsync())
            {
                doctors.Add(MapFromReader(reader));
            }

            return doctors;
        }

        public async Task<IEnumerable<Doctor>> GetActiveDoctorsAsync()
        {
            const string sql = @"
                SELECT d.DoctorId, d.FullName, d.SpecializationId, s.Name as SpecializationName,
                       d.ContactNumber, d.Email, d.Qualifications, d.ExperienceYears,
                       d.Details, d.HospitalName, d.Address, d.IsActive, d.CreatedAt, d.UpdatedAt
                FROM Doctors d
                LEFT JOIN Specializations s ON d.SpecializationId = s.SpecializationId
                WHERE d.IsActive = 1
                ORDER BY d.FullName";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            var doctors = new List<Doctor>();
            while (await reader.ReadAsync())
            {
                doctors.Add(MapFromReader(reader));
            }

            return doctors;
        }

        public async Task<Doctor?> GetByIdAsync(int id)
        {
            const string sql = @"
                SELECT d.DoctorId, d.FullName, d.SpecializationId, s.Name as SpecializationName,
                       d.ContactNumber, d.Email, d.Qualifications, d.ExperienceYears,
                       d.Details, d.HospitalName, d.Address, d.IsActive, d.CreatedAt, d.UpdatedAt
                FROM Doctors d
                LEFT JOIN Specializations s ON d.SpecializationId = s.SpecializationId
                WHERE d.DoctorId = @Id";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Id", id);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            return await reader.ReadAsync() ? MapFromReader(reader) : null;
        }

        public async Task<DoctorResponseDto?> GetDoctorWithSpecializationAsync(int doctorId)
        {
            const string sql = @"
                SELECT d.DoctorId, d.FullName, d.SpecializationId, s.Name as SpecializationName,
                       d.ContactNumber, d.Email, d.Qualifications, d.ExperienceYears,
                       d.Details, d.HospitalName, d.Address, d.IsActive, d.CreatedAt, d.UpdatedAt
                FROM Doctors d
                LEFT JOIN Specializations s ON d.SpecializationId = s.SpecializationId
                WHERE d.DoctorId = @DoctorId";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@DoctorId", doctorId);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            return await reader.ReadAsync() ? MapToDoctorResponseDto(reader) : null;
        }

        public async Task<IEnumerable<DoctorResponseDto>> GetAllDoctorsWithSpecializationAsync()
        {
            const string sql = @"
                SELECT d.DoctorId, d.FullName, d.SpecializationId, s.Name as SpecializationName,
                       d.ContactNumber, d.Email, d.Qualifications, d.ExperienceYears,
                       d.Details, d.HospitalName, d.Address, d.IsActive, d.CreatedAt, d.UpdatedAt
                FROM Doctors d
                LEFT JOIN Specializations s ON d.SpecializationId = s.SpecializationId
                ORDER BY d.FullName";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            var doctors = new List<DoctorResponseDto>();
            while (await reader.ReadAsync())
            {
                doctors.Add(MapToDoctorResponseDto(reader));
            }

            return doctors;
        }

        public async Task<IEnumerable<Doctor>> GetDoctorsBySpecializationAsync(int specializationId)
        {
            const string sql = @"
                SELECT d.DoctorId, d.FullName, d.SpecializationId, s.Name as SpecializationName,
                       d.ContactNumber, d.Email, d.Qualifications, d.ExperienceYears,
                       d.Details, d.HospitalName, d.Address, d.IsActive, d.CreatedAt, d.UpdatedAt
                FROM Doctors d
                LEFT JOIN Specializations s ON d.SpecializationId = s.SpecializationId
                WHERE d.SpecializationId = @SpecializationId AND d.IsActive = 1
                ORDER BY d.FullName";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@SpecializationId", specializationId);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            var doctors = new List<Doctor>();
            while (await reader.ReadAsync())
            {
                doctors.Add(MapFromReader(reader));
            }

            return doctors;
        }

        public async Task<IEnumerable<Doctor>> SearchDoctorsAsync(string? searchTerm, int? specializationId = null)
        {
            var sql = @"
                SELECT d.DoctorId, d.FullName, d.SpecializationId, s.Name as SpecializationName,
                       d.ContactNumber, d.Email, d.Qualifications, d.ExperienceYears,
                       d.Details, d.HospitalName, d.Address, d.IsActive, d.CreatedAt, d.UpdatedAt
                FROM Doctors d
                LEFT JOIN Specializations s ON d.SpecializationId = s.SpecializationId
                WHERE d.IsActive = 1";

            var parameters = new List<MySqlParameter>();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                sql += " AND (d.FullName LIKE @SearchTerm OR d.Qualifications LIKE @SearchTerm OR d.HospitalName LIKE @SearchTerm)";
                parameters.Add(new MySqlParameter("@SearchTerm", $"%{searchTerm}%"));
            }

            if (specializationId.HasValue)
            {
                sql += " AND d.SpecializationId = @SpecializationId";
                parameters.Add(new MySqlParameter("@SpecializationId", specializationId.Value));
            }

            sql += " ORDER BY d.FullName";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddRange(parameters.ToArray());

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            var doctors = new List<Doctor>();
            while (await reader.ReadAsync())
            {
                doctors.Add(MapFromReader(reader));
            }

            return doctors;
        }

        public async Task<Doctor> CreateAsync(Doctor entity)
        {
            const string sql = @"
                INSERT INTO Doctors (FullName, SpecializationId, ContactNumber, Email, Qualifications, 
                                   ExperienceYears, Details, HospitalName, Address, IsActive, CreatedAt, UpdatedAt) 
                VALUES (@FullName, @SpecializationId, @ContactNumber, @Email, @Qualifications, 
                        @ExperienceYears, @Details, @HospitalName, @Address, @IsActive, @CreatedAt, @UpdatedAt);
                SELECT LAST_INSERT_ID();";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);

            command.Parameters.AddWithValue("@FullName", entity.FullName);
            command.Parameters.AddWithValue("@SpecializationId", entity.SpecializationId);
            command.Parameters.AddWithValue("@ContactNumber", entity.ContactNumber);
            command.Parameters.AddWithValue("@Email", entity.Email);
            command.Parameters.AddWithValue("@Qualifications", entity.Qualifications);
            command.Parameters.AddWithValue("@ExperienceYears", entity.ExperienceYears);
            command.Parameters.AddWithValue("@Details", entity.Details);
            command.Parameters.AddWithValue("@HospitalName", entity.HospitalName);
            command.Parameters.AddWithValue("@Address", entity.Address);
            command.Parameters.AddWithValue("@IsActive", entity.IsActive);
            command.Parameters.AddWithValue("@CreatedAt", entity.CreatedAt);
            command.Parameters.AddWithValue("@UpdatedAt", entity.UpdatedAt);

            await connection.OpenAsync();
            var id = Convert.ToInt32(await command.ExecuteScalarAsync());
            entity.DoctorId = id;

            return entity;
        }

        public async Task<Doctor> UpdateAsync(Doctor entity)
        {
            const string sql = @"
                UPDATE Doctors 
                SET FullName = @FullName, SpecializationId = @SpecializationId, ContactNumber = @ContactNumber,
                    Email = @Email, Qualifications = @Qualifications, ExperienceYears = @ExperienceYears,
                    Details = @Details, HospitalName = @HospitalName, Address = @Address, 
                    IsActive = @IsActive, UpdatedAt = @UpdatedAt
                WHERE DoctorId = @Id";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);

            command.Parameters.AddWithValue("@Id", entity.DoctorId);
            command.Parameters.AddWithValue("@FullName", entity.FullName);
            command.Parameters.AddWithValue("@SpecializationId", entity.SpecializationId);
            command.Parameters.AddWithValue("@ContactNumber", entity.ContactNumber);
            command.Parameters.AddWithValue("@Email", entity.Email);
            command.Parameters.AddWithValue("@Qualifications", entity.Qualifications);
            command.Parameters.AddWithValue("@ExperienceYears", entity.ExperienceYears);
            command.Parameters.AddWithValue("@Details", entity.Details);
            command.Parameters.AddWithValue("@HospitalName", entity.HospitalName);
            command.Parameters.AddWithValue("@Address", entity.Address);
            command.Parameters.AddWithValue("@IsActive", entity.IsActive);
            command.Parameters.AddWithValue("@UpdatedAt", DateTime.Now);

            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();

            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            const string sql = "DELETE FROM Doctors WHERE DoctorId = @Id";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Id", id);

            await connection.OpenAsync();
            var rowsAffected = await command.ExecuteNonQueryAsync();

            return rowsAffected > 0;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            const string sql = "SELECT COUNT(1) FROM Doctors WHERE DoctorId = @Id";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Id", id);

            await connection.OpenAsync();
            var count = Convert.ToInt32(await command.ExecuteScalarAsync());

            return count > 0;
        }

        public async Task<bool> EmailExistsAsync(string email, int? excludeId = null)
        {
            var sql = "SELECT COUNT(1) FROM Doctors WHERE Email = @Email";
            if (excludeId.HasValue)
            {
                sql += " AND DoctorId != @ExcludeId";
            }

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Email", email);
            
            if (excludeId.HasValue)
            {
                command.Parameters.AddWithValue("@ExcludeId", excludeId.Value);
            }

            await connection.OpenAsync();
            var count = Convert.ToInt32(await command.ExecuteScalarAsync());

            return count > 0;
        }

        public async Task<IEnumerable<dynamic>> GetDoctorsWithScheduleStatsAsync()
        {
            const string sql = @"
                SELECT d.DoctorId, d.FullName, s.Name as SpecializationName, d.IsActive,
                       COUNT(ds.ScheduleId) as TotalSchedules,
                       COUNT(CASE WHEN ds.ScheduleDate >= CURDATE() THEN 1 END) as UpcomingSchedules,
                       COALESCE(SUM(ds.BookedSlots), 0) as TotalBookedSlots
                FROM Doctors d
                LEFT JOIN Specializations s ON d.SpecializationId = s.SpecializationId
                LEFT JOIN DoctorSchedules ds ON d.DoctorId = ds.DoctorId AND ds.IsActive = 1
                GROUP BY d.DoctorId, d.FullName, s.Name, d.IsActive
                ORDER BY d.FullName";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            var results = new List<dynamic>();
            while (await reader.ReadAsync())
            {
                results.Add(new
                {
                    DoctorId = reader.GetInt32("DoctorId"),
                    FullName = reader.GetString("FullName"),
                    SpecializationName = reader.IsDBNull("SpecializationName") ? "Unknown" : reader.GetString("SpecializationName"),
                    IsActive = reader.GetBoolean("IsActive"),
                    TotalSchedules = reader.GetInt32("TotalSchedules"),
                    UpcomingSchedules = reader.GetInt32("UpcomingSchedules"),
                    TotalBookedSlots = reader.GetInt32("TotalBookedSlots")
                });
            }

            return results;
        }

        private static Doctor MapFromReader(IDataReader reader)
        {
            return new Doctor
            {
                DoctorId = reader.GetInt32(reader.GetOrdinal("DoctorId")),
                FullName = reader.GetString(reader.GetOrdinal("FullName")),
                SpecializationId = reader.GetInt32(reader.GetOrdinal("SpecializationId")),
                SpecializationName = reader.IsDBNull(reader.GetOrdinal("SpecializationName")) ? null : reader.GetString(reader.GetOrdinal("SpecializationName")),
                ContactNumber = reader.GetString(reader.GetOrdinal("ContactNumber")),
                Email = reader.GetString(reader.GetOrdinal("Email")),
                Qualifications = reader.GetString(reader.GetOrdinal("Qualifications")),
                ExperienceYears = reader.GetInt32(reader.GetOrdinal("ExperienceYears")),
                Details = reader.IsDBNull(reader.GetOrdinal("Details")) ? null : reader.GetString(reader.GetOrdinal("Details")),
                HospitalName = reader.IsDBNull(reader.GetOrdinal("HospitalName")) ? null : reader.GetString(reader.GetOrdinal("HospitalName")),
                Address = reader.IsDBNull(reader.GetOrdinal("Address")) ? null : reader.GetString(reader.GetOrdinal("Address")),
                IsActive = reader.GetBoolean(reader.GetOrdinal("IsActive")),
                CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                UpdatedAt = reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
            };
        }

        private static DoctorResponseDto MapToDoctorResponseDto(IDataReader reader)
        {
            return new DoctorResponseDto
            {
                DoctorId = reader.GetInt32(reader.GetOrdinal("DoctorId")),
                FullName = reader.GetString(reader.GetOrdinal("FullName")),
                SpecializationId = reader.GetInt32(reader.GetOrdinal("SpecializationId")),
                SpecializationName = reader.IsDBNull(reader.GetOrdinal("SpecializationName")) ? "Unknown" : reader.GetString(reader.GetOrdinal("SpecializationName")),
                ContactNumber = reader.GetString(reader.GetOrdinal("ContactNumber")),
                Email = reader.GetString(reader.GetOrdinal("Email")),
                Qualifications = reader.GetString(reader.GetOrdinal("Qualifications")),
                ExperienceYears = reader.GetInt32(reader.GetOrdinal("ExperienceYears")),
                Details = reader.IsDBNull(reader.GetOrdinal("Details")) ? null : reader.GetString(reader.GetOrdinal("Details")),
                HospitalName = reader.IsDBNull(reader.GetOrdinal("HospitalName")) ? null : reader.GetString(reader.GetOrdinal("HospitalName")),
                Address = reader.IsDBNull(reader.GetOrdinal("Address")) ? null : reader.GetString(reader.GetOrdinal("Address")),
                IsActive = reader.GetBoolean(reader.GetOrdinal("IsActive")),
                CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                UpdatedAt = reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
            };
        }
    }
}
