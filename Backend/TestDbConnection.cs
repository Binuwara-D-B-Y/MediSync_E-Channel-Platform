using Microsoft.Data.SqlClient;
using System;

class TestDbConnection
{
    static void Main()
    {
        var connectionString = "Server=tcp:medisyncadmin.database.windows.net,1433;Initial Catalog=MediSyncDb;Persist Security Info=False;User ID=medisyncadmin;Password=pass#medi@123;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";
        
        try
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();
            Console.WriteLine("✅ Database connection successful!");
            
            using var command = new SqlCommand("SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES", connection);
            var tableCount = command.ExecuteScalar();
            Console.WriteLine($"📊 Found {tableCount} tables in database");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Database connection failed: {ex.Message}");
        }
    }
}