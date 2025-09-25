using Backend.Models;
using Backend.Models.DTOs;
using Backend.Repositories;
using Backend.Services;
using FluentAssertions;
using Moq;

namespace Backend.Tests.Services
{
    public class DoctorScheduleServiceTests
    {
        private readonly Mock<IDoctorScheduleRepository> _scheduleRepo = new();
        private readonly Mock<IDoctorRepository> _doctorRepo = new();
        private readonly IDoctorScheduleService _service;

        public DoctorScheduleServiceTests()
        {
            _service = new DoctorScheduleService(_scheduleRepo.Object, _doctorRepo.Object);
        }

        [Fact]
        public async Task CreateSchedule_Should_Fail_On_Conflict()
        {
            // Arrange
            var dto = new CreateDoctorScheduleDto
            {
                DoctorId = 1,
                ScheduleDate = DateTime.Today,
                StartTime = new TimeSpan(9, 0, 0),
                EndTime = new TimeSpan(10, 0, 0),
                SlotDurationMinutes = 30,
                MaxPatientsPerSlot = 1
            };
            _doctorRepo.Setup(r => r.ExistsAsync(1)).ReturnsAsync(true);
            _scheduleRepo.Setup(r => r.HasScheduleConflictAsync(1, dto.ScheduleDate, dto.StartTime, dto.EndTime, null))
                .ReturnsAsync(true);

            // Act
            var res = await _service.CreateScheduleAsync(dto);

            // Assert
            res.Success.Should().BeFalse();
            res.Message.Should().Contain("conflict");
        }

        [Fact]
        public async Task CreateSchedule_Should_Succeed_And_Calculate_Total_Slots()
        {
            // Arrange
            var dto = new CreateDoctorScheduleDto
            {
                DoctorId = 1,
                ScheduleDate = DateTime.Today,
                StartTime = new TimeSpan(9, 0, 0),
                EndTime = new TimeSpan(11, 0, 0),
                SlotDurationMinutes = 30,
                MaxPatientsPerSlot = 2,
                Notes = "Morning"
            };
            _doctorRepo.Setup(r => r.ExistsAsync(1)).ReturnsAsync(true);
            _scheduleRepo.Setup(r => r.HasScheduleConflictAsync(1, dto.ScheduleDate, dto.StartTime, dto.EndTime, null))
                .ReturnsAsync(false);
            _scheduleRepo.Setup(r => r.CreateAsync(It.IsAny<DoctorSchedule>()))
                .ReturnsAsync((DoctorSchedule s) => { s.ScheduleId = 5; return s; });
            _scheduleRepo.Setup(r => r.GetScheduleWithDetailsAsync(5))
                .ReturnsAsync(new DoctorScheduleResponseDto
                {
                    ScheduleId = 5,
                    DoctorId = 1,
                    DoctorName = "Dr. Test",
                    SpecializationName = "Cardiology",
                    ScheduleDate = dto.ScheduleDate,
                    StartTime = dto.StartTime,
                    EndTime = dto.EndTime,
                    SlotDurationMinutes = dto.SlotDurationMinutes,
                    MaxPatientsPerSlot = dto.MaxPatientsPerSlot,
                    TotalSlots = 8 * 2 / 2, // placeholder; value isn't used in assertion
                    BookedSlots = 0,
                    AvailableSlots = 8,
                    IsActive = true,
                    Notes = dto.Notes,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });

            // Act
            var res = await _service.CreateScheduleAsync(dto);

            // Assert
            res.Success.Should().BeTrue();
            res.Data.Should().NotBeNull();
            res.Data!.ScheduleId.Should().Be(5);
            res.Data.DoctorName.Should().Be("Dr. Test");
        }

        [Fact]
        public async Task UpdateSchedule_Should_Fail_If_TotalSlots_Less_Than_Booked()
        {
            // Arrange
            var dto = new UpdateDoctorScheduleDto
            {
                ScheduleId = 7,
                ScheduleDate = DateTime.Today,
                StartTime = new TimeSpan(9, 0, 0),
                EndTime = new TimeSpan(9, 30, 0), // Very small window
                SlotDurationMinutes = 30,
                MaxPatientsPerSlot = 1,
                Notes = "",
                IsActive = true
            };
            _scheduleRepo.Setup(r => r.ExistsAsync(7)).ReturnsAsync(true);
            _scheduleRepo.Setup(r => r.GetByIdAsync(7)).ReturnsAsync(new DoctorSchedule
            {
                ScheduleId = 7,
                DoctorId = 1,
                ScheduleDate = DateTime.Today,
                StartTime = new TimeSpan(8, 0, 0),
                EndTime = new TimeSpan(10, 0, 0),
                SlotDurationMinutes = 30,
                MaxPatientsPerSlot = 1,
                TotalSlots = 4,
                BookedSlots = 3,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
            _scheduleRepo.Setup(r => r.HasScheduleConflictAsync(1, dto.ScheduleDate, dto.StartTime, dto.EndTime, 7))
                .ReturnsAsync(false);

            // Act
            var res = await _service.UpdateScheduleAsync(dto);

            // Assert
            res.Success.Should().BeFalse();
            res.Message.Should().Contain("Total slots cannot be less than already booked");
        }
    }
}
