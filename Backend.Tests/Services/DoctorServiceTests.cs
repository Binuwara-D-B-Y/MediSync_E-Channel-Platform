using Backend.Models;
using Backend.Models.DTOs;
using Backend.Repositories;
using Backend.Services;
using FluentAssertions;
using Moq;

namespace Backend.Tests.Services
{
    public class DoctorServiceTests
    {
        private readonly Mock<IDoctorRepository> _doctorRepo = new();
        private readonly Mock<ISpecializationRepository> _specRepo = new();
        private readonly IDoctorService _service;

        public DoctorServiceTests()
        {
            _service = new DoctorServiceImpl(_doctorRepo.Object, _specRepo.Object);
        }

        [Fact]
        public async Task CreateDoctor_Should_Succeed_When_Email_Unique_And_Specialization_Valid()
        {
            // Arrange
            var dto = new CreateDoctorDto
            {
                FullName = "Dr. Test",
                SpecializationId = 1,
                ContactNumber = "0712345678",
                Email = "test@example.com",
                Qualifications = "MBBS",
                ExperienceYears = 5,
                Details = "",
                HospitalName = "ABC",
                Address = "Colombo"
            };
            _specRepo.Setup(r => r.ExistsAsync(1)).ReturnsAsync(true);
            _doctorRepo.Setup(r => r.EmailExistsAsync(dto.Email, null)).ReturnsAsync(false);
            _doctorRepo.Setup(r => r.EmailExistsAsync(dto.Email, It.IsAny<int>())).ReturnsAsync(false);
            _doctorRepo.Setup(r => r.CreateAsync(It.IsAny<Doctor>()))
                .ReturnsAsync((Doctor d) => { d.DoctorId = 10; return d; });
            _doctorRepo.Setup(r => r.GetDoctorWithSpecializationAsync(10))
                .ReturnsAsync(new DoctorResponseDto
                {
                    DoctorId = 10,
                    FullName = dto.FullName,
                    SpecializationId = 1,
                    SpecializationName = "Cardiology",
                    Email = dto.Email,
                    ContactNumber = dto.ContactNumber,
                    Qualifications = dto.Qualifications,
                    ExperienceYears = dto.ExperienceYears,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });

            // Act
            var res = await _service.CreateDoctorAsync(dto);

            // Assert
            res.Success.Should().BeTrue();
            res.Data.Should().NotBeNull();
            res.Data!.DoctorId.Should().Be(10);
            res.Data!.SpecializationName.Should().Be("Cardiology");
        }

        [Fact]
        public async Task CreateDoctor_Should_Fail_When_Email_Duplicate()
        {
            // Arrange
            var dto = new CreateDoctorDto
            {
                FullName = "Dr. Test",
                SpecializationId = 1,
                ContactNumber = "0712345678",
                Email = "dup@example.com",
                Qualifications = "MBBS",
                ExperienceYears = 5
            };
            _specRepo.Setup(r => r.ExistsAsync(1)).ReturnsAsync(true);
            _doctorRepo.Setup(r => r.EmailExistsAsync(dto.Email, null)).ReturnsAsync(true);

            // Act
            var res = await _service.CreateDoctorAsync(dto);

            // Assert
            res.Success.Should().BeFalse();
            res.Message.Should().Contain("already exists");
        }
    }
}
