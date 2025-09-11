using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClinicWebApp.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPasswordResetColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PasswordResetToken",
                table: "Patients",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PasswordResetTokenExpiresUtc",
                table: "Patients",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordResetToken",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "PasswordResetTokenExpiresUtc",
                table: "Patients");
        }
    }
}
