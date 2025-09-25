using Backend.Models;
using Backend.Models.DTOs;
using Backend.Services;
using MySql.Data.MySqlClient;
using System.Data;

namespace Backend.Repositories
{
    /// <summary>
    /// Repository implementation for DoctorSchedule entity using ADO.NET and raw SQL
    /// </summary>
    public class DoctorScheduleRepository : IDoctorScheduleRepository
    {
        private readonly IDatabaseConnectionService _connectionService;

        public DoctorScheduleRepository(IDatabaseConnectionService connectionService)
        {
            _connectionService = connectionService;
        }

        public async Task<IEnumerable<DoctorSchedule>> GetAllAsync()
        {
            const string sql = @"
                SELECT ScheduleId, DoctorId, ScheduleDate, StartTime, EndTime,
                       SlotDurationMinutes, MaxPatientsPerSlot, TotalSlots, BookedSlots,
                       IsActive, Notes, CreatedAt, UpdatedAt
                FROM DoctorSchedules
                ORDER BY ScheduleDate DESC, StartTime DESC";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            var schedules = new List<DoctorSchedule>();
            while (await reader.ReadAsync())
            {
                schedules.Add(MapFromReader(reader));
            }

            return schedules;
        }

        public async Task<DoctorSchedule?> GetByIdAsync(int id)
        {
            const string sql = @"
                SELECT ScheduleId, DoctorId, ScheduleDate, StartTime, EndTime,
                       SlotDurationMinutes, MaxPatientsPerSlot, TotalSlots, BookedSlots,
                       IsActive, Notes, CreatedAt, UpdatedAt
                FROM DoctorSchedules
                WHERE ScheduleId = @Id";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Id", id);
            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();
            return await reader.ReadAsync() ? MapFromReader(reader) : null;
        }

        public async Task<DoctorSchedule> CreateAsync(DoctorSchedule entity)
        {
            const string sql = @"
                INSERT INTO DoctorSchedules (
                    DoctorId, ScheduleDate, StartTime, EndTime,
                    SlotDurationMinutes, MaxPatientsPerSlot, TotalSlots, BookedSlots,
                    IsActive, Notes, CreatedAt, UpdatedAt)
                VALUES (
                    @DoctorId, @ScheduleDate, @StartTime, @EndTime,
                    @SlotDurationMinutes, @MaxPatientsPerSlot, @TotalSlots, @BookedSlots,
                    @IsActive, @Notes, @CreatedAt, @UpdatedAt);
                SELECT LAST_INSERT_ID();";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);

            command.Parameters.AddWithValue("@DoctorId", entity.DoctorId);
            command.Parameters.AddWithValue("@ScheduleDate", entity.ScheduleDate);
            command.Parameters.AddWithValue("@StartTime", entity.StartTime);
            command.Parameters.AddWithValue("@EndTime", entity.EndTime);
            command.Parameters.AddWithValue("@SlotDurationMinutes", entity.SlotDurationMinutes);
            command.Parameters.AddWithValue("@MaxPatientsPerSlot", entity.MaxPatientsPerSlot);
            command.Parameters.AddWithValue("@TotalSlots", entity.TotalSlots);
            command.Parameters.AddWithValue("@BookedSlots", entity.BookedSlots);
            command.Parameters.AddWithValue("@IsActive", entity.IsActive);
            command.Parameters.AddWithValue("@Notes", (object?)entity.Notes ?? DBNull.Value);
            command.Parameters.AddWithValue("@CreatedAt", entity.CreatedAt);
            command.Parameters.AddWithValue("@UpdatedAt", entity.UpdatedAt);

            await connection.OpenAsync();
            var id = Convert.ToInt32(await command.ExecuteScalarAsync());
            entity.ScheduleId = id;
            return entity;
        }

        public async Task<DoctorSchedule> UpdateAsync(DoctorSchedule entity)
        {
            const string sql = @"
                UPDATE DoctorSchedules SET
                    DoctorId = @DoctorId,
                    ScheduleDate = @ScheduleDate,
                    StartTime = @StartTime,
                    EndTime = @EndTime,
                    SlotDurationMinutes = @SlotDurationMinutes,
                    MaxPatientsPerSlot = @MaxPatientsPerSlot,
                    TotalSlots = @TotalSlots,
                    BookedSlots = @BookedSlots,
                    IsActive = @IsActive,
                    Notes = @Notes,
                    UpdatedAt = @UpdatedAt
                WHERE ScheduleId = @Id";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);

            command.Parameters.AddWithValue("@Id", entity.ScheduleId);
            command.Parameters.AddWithValue("@DoctorId", entity.DoctorId);
            command.Parameters.AddWithValue("@ScheduleDate", entity.ScheduleDate);
            command.Parameters.AddWithValue("@StartTime", entity.StartTime);
            command.Parameters.AddWithValue("@EndTime", entity.EndTime);
            command.Parameters.AddWithValue("@SlotDurationMinutes", entity.SlotDurationMinutes);
            command.Parameters.AddWithValue("@MaxPatientsPerSlot", entity.MaxPatientsPerSlot);
            command.Parameters.AddWithValue("@TotalSlots", entity.TotalSlots);
            command.Parameters.AddWithValue("@BookedSlots", entity.BookedSlots);
            command.Parameters.AddWithValue("@IsActive", entity.IsActive);
            command.Parameters.AddWithValue("@Notes", (object?)entity.Notes ?? DBNull.Value);
            command.Parameters.AddWithValue("@UpdatedAt", DateTime.Now);

            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            const string sql = "DELETE FROM DoctorSchedules WHERE ScheduleId = @Id";
            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Id", id);
            await connection.OpenAsync();
            var rows = await command.ExecuteNonQueryAsync();
            return rows > 0;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            const string sql = "SELECT COUNT(1) FROM DoctorSchedules WHERE ScheduleId = @Id";
            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Id", id);
            await connection.OpenAsync();
            var count = Convert.ToInt32(await command.ExecuteScalarAsync());
            return count > 0;
        }

        public async Task<IEnumerable<DoctorSchedule>> GetSchedulesByDoctorAsync(int doctorId)
        {
            const string sql = @"
                SELECT ScheduleId, DoctorId, ScheduleDate, StartTime, EndTime,
                       SlotDurationMinutes, MaxPatientsPerSlot, TotalSlots, BookedSlots,
                       IsActive, Notes, CreatedAt, UpdatedAt
                FROM DoctorSchedules
                WHERE DoctorId = @DoctorId
                ORDER BY ScheduleDate DESC, StartTime DESC";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@DoctorId", doctorId);
            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();
            var schedules = new List<DoctorSchedule>();
            while (await reader.ReadAsync())
            {
                schedules.Add(MapFromReader(reader));
            }
            return schedules;
        }

        public async Task<IEnumerable<DoctorSchedule>> GetSchedulesByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            const string sql = @"
                SELECT ScheduleId, DoctorId, ScheduleDate, StartTime, EndTime,
                       SlotDurationMinutes, MaxPatientsPerSlot, TotalSlots, BookedSlots,
                       IsActive, Notes, CreatedAt, UpdatedAt
                FROM DoctorSchedules
                WHERE ScheduleDate BETWEEN @StartDate AND @EndDate
                ORDER BY ScheduleDate ASC, StartTime ASC";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@StartDate", startDate.Date);
            command.Parameters.AddWithValue("@EndDate", endDate.Date);
            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();
            var schedules = new List<DoctorSchedule>();
            while (await reader.ReadAsync())
            {
                schedules.Add(MapFromReader(reader));
            }
            return schedules;
        }

        public async Task<IEnumerable<DoctorSchedule>> GetSchedulesByDoctorAndDateAsync(int doctorId, DateTime date)
        {
            const string sql = @"
                SELECT ScheduleId, DoctorId, ScheduleDate, StartTime, EndTime,
                       SlotDurationMinutes, MaxPatientsPerSlot, TotalSlots, BookedSlots,
                       IsActive, Notes, CreatedAt, UpdatedAt
                FROM DoctorSchedules
                WHERE DoctorId = @DoctorId AND ScheduleDate = @Date
                ORDER BY StartTime ASC";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@DoctorId", doctorId);
            command.Parameters.AddWithValue("@Date", date.Date);
            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();
            var schedules = new List<DoctorSchedule>();
            while (await reader.ReadAsync())
            {
                schedules.Add(MapFromReader(reader));
            }
            return schedules;
        }

        public async Task<IEnumerable<DoctorSchedule>> GetAvailableSchedulesAsync(int? doctorId = null, DateTime? date = null)
        {
            var sql = @"
                SELECT ScheduleId, DoctorId, ScheduleDate, StartTime, EndTime,
                       SlotDurationMinutes, MaxPatientsPerSlot, TotalSlots, BookedSlots,
                       IsActive, Notes, CreatedAt, UpdatedAt
                FROM DoctorSchedules
                WHERE IsActive = 1 AND (TotalSlots - BookedSlots) > 0";

            var parameters = new List<MySqlParameter>();

            if (doctorId.HasValue)
            {
                sql += " AND DoctorId = @DoctorId";
                parameters.Add(new MySqlParameter("@DoctorId", doctorId.Value));
            }

            if (date.HasValue)
            {
                sql += " AND ScheduleDate = @Date";
                parameters.Add(new MySqlParameter("@Date", date.Value.Date));
            }

            sql += " ORDER BY ScheduleDate ASC, StartTime ASC";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddRange(parameters.ToArray());
            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();
            var schedules = new List<DoctorSchedule>();
            while (await reader.ReadAsync())
            {
                schedules.Add(MapFromReader(reader));
            }
            return schedules;
        }

        public async Task<DoctorScheduleResponseDto?> GetScheduleWithDetailsAsync(int scheduleId)
        {
            const string sql = @"
                SELECT ds.ScheduleId, ds.DoctorId, d.FullName as DoctorName, s.Name as SpecializationName,
                       ds.ScheduleDate, ds.StartTime, ds.EndTime, ds.SlotDurationMinutes,
                       ds.MaxPatientsPerSlot, ds.TotalSlots, ds.BookedSlots, ds.IsActive, ds.Notes,
                       ds.CreatedAt, ds.UpdatedAt
                FROM DoctorSchedules ds
                LEFT JOIN Doctors d ON ds.DoctorId = d.DoctorId
                LEFT JOIN Specializations s ON d.SpecializationId = s.SpecializationId
                WHERE ds.ScheduleId = @ScheduleId";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@ScheduleId", scheduleId);
            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return MapToScheduleResponseDto(reader);
            }
            return null;
        }

        public async Task<IEnumerable<DoctorScheduleResponseDto>> GetAllSchedulesWithDetailsAsync()
        {
            const string sql = @"
                SELECT ds.ScheduleId, ds.DoctorId, d.FullName as DoctorName, s.Name as SpecializationName,
                       ds.ScheduleDate, ds.StartTime, ds.EndTime, ds.SlotDurationMinutes,
                       ds.MaxPatientsPerSlot, ds.TotalSlots, ds.BookedSlots, ds.IsActive, ds.Notes,
                       ds.CreatedAt, ds.UpdatedAt
                FROM DoctorSchedules ds
                LEFT JOIN Doctors d ON ds.DoctorId = d.DoctorId
                LEFT JOIN Specializations s ON d.SpecializationId = s.SpecializationId
                ORDER BY ds.ScheduleDate DESC, ds.StartTime DESC";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();
            var schedules = new List<DoctorScheduleResponseDto>();
            while (await reader.ReadAsync())
            {
                schedules.Add(MapToScheduleResponseDto(reader));
            }
            return schedules;
        }

        public async Task<bool> HasScheduleConflictAsync(int doctorId, DateTime date, TimeSpan startTime, TimeSpan endTime, int? excludeScheduleId = null)
        {
            var sql = @"
                SELECT COUNT(1)
                FROM DoctorSchedules
                WHERE DoctorId = @DoctorId AND ScheduleDate = @Date AND IsActive = 1
                  AND ((@StartTime < EndTime AND @EndTime > StartTime))";

            if (excludeScheduleId.HasValue)
            {
                sql += " AND ScheduleId != @ExcludeId";
            }

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@DoctorId", doctorId);
            command.Parameters.AddWithValue("@Date", date.Date);
            command.Parameters.AddWithValue("@StartTime", startTime);
            command.Parameters.AddWithValue("@EndTime", endTime);
            if (excludeScheduleId.HasValue)
            {
                command.Parameters.AddWithValue("@ExcludeId", excludeScheduleId.Value);
            }

            await connection.OpenAsync();
            var count = Convert.ToInt32(await command.ExecuteScalarAsync());
            return count > 0;
        }

        public async Task<bool> UpdateBookedSlotsAsync(int scheduleId, int increment)
        {
            const string sql = @"
                UPDATE DoctorSchedules
                SET BookedSlots = GREATEST(0, LEAST(TotalSlots, BookedSlots + @Inc)), UpdatedAt = @UpdatedAt
                WHERE ScheduleId = @Id";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Id", scheduleId);
            command.Parameters.AddWithValue("@Inc", increment);
            command.Parameters.AddWithValue("@UpdatedAt", DateTime.Now);
            await connection.OpenAsync();
            var rows = await command.ExecuteNonQueryAsync();
            return rows > 0;
        }

        public async Task<IEnumerable<DoctorSchedule>> GetUpcomingSchedulesAsync(int doctorId, int days = 30)
        {
            const string sql = @"
                SELECT ScheduleId, DoctorId, ScheduleDate, StartTime, EndTime,
                       SlotDurationMinutes, MaxPatientsPerSlot, TotalSlots, BookedSlots,
                       IsActive, Notes, CreatedAt, UpdatedAt
                FROM DoctorSchedules
                WHERE DoctorId = @DoctorId AND ScheduleDate BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL @Days DAY)
                ORDER BY ScheduleDate ASC, StartTime ASC";

            using var connection = _connectionService.CreateConnection();
            using var command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@DoctorId", doctorId);
            command.Parameters.AddWithValue("@Days", days);
            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();
            var schedules = new List<DoctorSchedule>();
            while (await reader.ReadAsync())
            {
                schedules.Add(MapFromReader(reader));
            }
            return schedules;
        }

        private static DoctorSchedule MapFromReader(IDataReader reader)
        {
            return new DoctorSchedule
            {
                ScheduleId = reader.GetInt32(reader.GetOrdinal("ScheduleId")),
                DoctorId = reader.GetInt32(reader.GetOrdinal("DoctorId")),
                ScheduleDate = reader.GetDateTime(reader.GetOrdinal("ScheduleDate")),
                StartTime = (TimeSpan)reader[reader.GetOrdinal("StartTime")],
                EndTime = (TimeSpan)reader[reader.GetOrdinal("EndTime")],
                SlotDurationMinutes = reader.GetInt32(reader.GetOrdinal("SlotDurationMinutes")),
                MaxPatientsPerSlot = reader.GetInt32(reader.GetOrdinal("MaxPatientsPerSlot")),
                TotalSlots = reader.GetInt32(reader.GetOrdinal("TotalSlots")),
                BookedSlots = reader.GetInt32(reader.GetOrdinal("BookedSlots")),
                IsActive = reader.GetBoolean(reader.GetOrdinal("IsActive")),
                Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? null : reader.GetString(reader.GetOrdinal("Notes")),
                CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                UpdatedAt = reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
            };
        }

        private static DoctorScheduleResponseDto MapToScheduleResponseDto(IDataReader reader)
        {
            var totalSlots = reader.GetInt32(reader.GetOrdinal("TotalSlots"));
            var bookedSlots = reader.GetInt32(reader.GetOrdinal("BookedSlots"));
            return new DoctorScheduleResponseDto
            {
                ScheduleId = reader.GetInt32(reader.GetOrdinal("ScheduleId")),
                DoctorId = reader.GetInt32(reader.GetOrdinal("DoctorId")),
                DoctorName = reader.IsDBNull(reader.GetOrdinal("DoctorName")) ? "Unknown" : reader.GetString(reader.GetOrdinal("DoctorName")),
                SpecializationName = reader.IsDBNull(reader.GetOrdinal("SpecializationName")) ? "Unknown" : reader.GetString(reader.GetOrdinal("SpecializationName")),
                ScheduleDate = reader.GetDateTime(reader.GetOrdinal("ScheduleDate")),
                StartTime = (TimeSpan)reader[reader.GetOrdinal("StartTime")],
                EndTime = (TimeSpan)reader[reader.GetOrdinal("EndTime")],
                SlotDurationMinutes = reader.GetInt32(reader.GetOrdinal("SlotDurationMinutes")),
                MaxPatientsPerSlot = reader.GetInt32(reader.GetOrdinal("MaxPatientsPerSlot")),
                TotalSlots = totalSlots,
                BookedSlots = bookedSlots,
                AvailableSlots = Math.Max(0, totalSlots - bookedSlots),
                IsActive = reader.GetBoolean(reader.GetOrdinal("IsActive")),
                Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? null : reader.GetString(reader.GetOrdinal("Notes")),
                CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                UpdatedAt = reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
            };
        }
    }
}
