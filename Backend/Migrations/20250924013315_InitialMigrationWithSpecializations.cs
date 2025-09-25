using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigrationWithSpecializations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Specialization",
                table: "Doctors");

            migrationBuilder.AddColumn<int>(
                name: "BookedSlots",
                table: "DoctorSchedules",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "DoctorSchedules",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "MaxPatientsPerSlot",
                table: "DoctorSchedules",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "DoctorSchedules",
                type: "varchar(200)",
                maxLength: 200,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "SlotDurationMinutes",
                table: "DoctorSchedules",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "Details",
                table: "Doctors",
                type: "varchar(300)",
                maxLength: 300,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(300)",
                oldMaxLength: 300)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Doctors",
                type: "varchar(200)",
                maxLength: 200,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ContactNumber",
                table: "Doctors",
                type: "varchar(15)",
                maxLength: 15,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Doctors",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "ExperienceYears",
                table: "Doctors",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "HospitalName",
                table: "Doctors",
                type: "varchar(100)",
                maxLength: 100,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Doctors",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Qualifications",
                table: "Doctors",
                type: "varchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "SpecializationId",
                table: "Doctors",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "SpecializationName",
                table: "Doctors",
                type: "varchar(50)",
                maxLength: 50,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Specializations",
                columns: table => new
                {
                    SpecializationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.ComputedColumn)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Specializations", x => x.SpecializationId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Doctors_SpecializationId",
                table: "Doctors",
                column: "SpecializationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Doctors_Specializations_SpecializationId",
                table: "Doctors",
                column: "SpecializationId",
                principalTable: "Specializations",
                principalColumn: "SpecializationId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Doctors_Specializations_SpecializationId",
                table: "Doctors");

            migrationBuilder.DropTable(
                name: "Specializations");

            migrationBuilder.DropIndex(
                name: "IX_Doctors_SpecializationId",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "BookedSlots",
                table: "DoctorSchedules");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "DoctorSchedules");

            migrationBuilder.DropColumn(
                name: "MaxPatientsPerSlot",
                table: "DoctorSchedules");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "DoctorSchedules");

            migrationBuilder.DropColumn(
                name: "SlotDurationMinutes",
                table: "DoctorSchedules");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "ContactNumber",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "ExperienceYears",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "HospitalName",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "Qualifications",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "SpecializationId",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "SpecializationName",
                table: "Doctors");

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Details",
                keyValue: null,
                column: "Details",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "Details",
                table: "Doctors",
                type: "varchar(300)",
                maxLength: 300,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(300)",
                oldMaxLength: 300,
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Specialization",
                table: "Doctors",
                type: "varchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
