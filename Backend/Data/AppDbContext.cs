using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using MySql.Data.MySqlClient;
using Backend.Models;

namespace Backend.Data
{
    public class AppDbContext
    {
        private readonly string _connectionString;

        public AppDbContext(string connectionString)
        {
            _connectionString = connectionString;
        }

        // Example: Get all users
        public List<User> GetAllUsers()
        {
            var users = new List<User>();
            using (var conn = new MySqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new MySqlCommand("SELECT user_id, full_name, email, password_hash, role, contact_number, created_at, updated_at FROM Users", conn))
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        users.Add(new User
                        {
                            UserId = reader.GetInt32("user_id"),
                            FullName = reader.GetString("full_name"),
                            Email = reader.GetString("email"),
                            PasswordHash = reader.GetString("password_hash"),
                            Role = Enum.Parse<UserRole>(reader.GetString("role")),
                            ContactNumber = reader.IsDBNull(reader.GetOrdinal("contact_number")) ? null : reader.GetString("contact_number"),
                            CreatedAt = reader.GetDateTime("created_at"),
                            UpdatedAt = reader.GetDateTime("updated_at")
                        });
                    }
                }
            }
            return users;
        }

        // Add similar methods for Doctors, Appointments, etc.
    }
}
