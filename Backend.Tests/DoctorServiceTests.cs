using Backend.Models;
using Backend.Models.DTOs;
using Backend.Repositories;
using Backend.Services;
using FluentAssertions;
using Moq;

namespace Backend.Tests
{
    public class DoctorServiceTests
    {
        private readonly Mock<IDoctorRepository> _mockDoctorRepository;
        private readonly Mock<ISpecializationRepository> _mockSpecializationRepository;
        private readonly DoctorServiceImpl _service;

        public DoctorServiceTests()
        {
            _mockDoctorRepository = new Mock<IDoctorRepository>();
            _mockSpecializationRepository = new Mock<ISpecializationRepository>();
            _service = new DoctorServiceImpl(_mockDoctorRepository.Object, _mockSpecializationRepository.Object);
        }

        [Fact]
        public async Task GetAllDoctorsAsync_WhenSuccessful_ReturnsSuccessResponse()
        {
            // Arrange
            var doctors = new List<DoctorResponseDto>
            {
                new DoctorResponseDto
                {
                    DoctorId = 1,
                    FullName = "Dr. John Doe",
                    SpecializationName = "Cardiology",
                    Email = "john@example.com",
                    ContactNumber = "1234567890",
                    Qualifications = "MBBS, MD",
                    ExperienceYears = 10,
                    IsActive = true
                },
                new DoctorResponseDto
                {
                    DoctorId = 2,
                    FullName = "Dr. Jane Smith",
                    SpecializationName = "Neurology",
                    Email = "jane@example.com",
                    ContactNumber = "0987654321",
                    Qualifications = "MBBS, MS",
                    ExperienceYears = 8,
                    IsActive = true
                }
            };

            _mockDoctorRepository.Setup(x => x.GetAllDoctorsWithSpecializationAsync())
                .ReturnsAsync(doctors);

            // Act
            var result = await _service.GetAllDoctorsAsync();

            // Assert
            result.Should().NotBeNull();
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Doctors retrieved successfully");
            result.Data.Should().NotBeNull();
            result.Data.Should().HaveCount(2);
            result.Data!.First().FullName.Should().Be("Dr. John Doe");
        }

        [Fact]
        public async Task GetAllDoctorsAsync_WhenExceptionThrown_ReturnsFailureResponse()
        {
            // Arrange
            _mockDoctorRepository.Setup(x => x.GetAllDoctorsWithSpecializationAsync())
                .ThrowsAsync(new Exception("Database connection failed"));

            // Act
            var result = await _service.GetAllDoctorsAsync();

            // Assert
            result.Should().NotBeNull();
            result.Success.Should().BeFalse();
            result.Message.Should().Contain("Error retrieving doctors");
            result.Message.Should().Contain("Database connection failed");
            result.Data.Should().BeNull();
        }

        [Fact]
        public async Task GetActiveDoctorsAsync_WhenSuccessful_ReturnsOnlyActiveDoctors()
        {
            // Arrange
            var activeDoctors = new List<Doctor>
            {
                new Doctor
                {
                    DoctorId = 1,
                    FullName = "Dr. John Doe",
                    SpecializationId = 1,
                    SpecializationName = "Cardiology",
                    Email = "john@example.com",
                    ContactNumber = "1234567890",
                    Qualifications = "MBBS, MD",
                    ExperienceYears = 10,
                    IsActive = true,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                }
            };

            _mockDoctorRepository.Setup(x => x.GetActiveDoctorsAsync())
                .ReturnsAsync(activeDoctors);

            // Act
            var result = await _service.GetActiveDoctorsAsync();

            // Assert
            result.Should().NotBeNull();
            result.Success.Should().BeTrue();
            result.Data.Should().NotBeNull();
            result.Data.Should().HaveCount(1);
            result.Data!.First().IsActive.Should().BeTrue();
            result.Data!.First().FullName.Should().Be("Dr. John Doe");
        }

        [Fact]
        public async Task GetDoctorByIdAsync_WhenDoctorExists_ReturnsDoctor()
        {
            // Arrange
            var doctorId = 1;
            var doctor = new DoctorResponseDto
            {
                DoctorId = doctorId,
                FullName = "Dr. John Doe",
                SpecializationName = "Cardiology",
                Email = "john@example.com",
                ContactNumber = "1234567890",
                Qualifications = "MBBS, MD",
                ExperienceYears = 10,
                IsActive = true
            };

            _mockDoctorRepository.Setup(x => x.GetDoctorWithSpecializationAsync(doctorId))
                .ReturnsAsync(doctor);

            // Act
            var result = await _service.GetDoctorByIdAsync(doctorId);

            // Assert
            result.Should().NotBeNull();
            result.Success.Should().BeTrue();
            result.Data.Should().NotBeNull();
            result.Data!.DoctorId.Should().Be(doctorId);
            result.Data!.FullName.Should().Be("Dr. John Doe");
        }

        [Fact]
        public async Task GetDoctorByIdAsync_WhenDoctorNotFound_ReturnsFailureResponse()
        {
            // Arrange
            var doctorId = 999;
            _mockDoctorRepository.Setup(x => x.GetDoctorWithSpecializationAsync(doctorId))
                .ReturnsAsync((DoctorResponseDto?)null);

            // Act
            var result = await _service.GetDoctorByIdAsync(doctorId);

            // Assert
            result.Should().NotBeNull();
            result.Success.Should().BeFalse();
            result.Message.Should().Contain("Doctor not found");
            result.Data.Should().BeNull();
        }

        [Fact]
        public async Task CreateDoctorAsync_WithValidData_ReturnsCreatedDoctor()
        {
            // Arrange
            var createDto = new CreateDoctorDto
            {
                FullName = "Dr. New Doctor",
                SpecializationId = 1,
                Email = "newdoctor@example.com",
                ContactNumber = "1234567890",
                Qualifications = "MBBS",
                ExperienceYears = 5,
                Details = "Experienced doctor",
                HospitalName = "City Hospital",
                Address = "123 Main St"
            };

            var createdDoctor = new Doctor
            {
                DoctorId = 1,
                FullName = createDto.FullName,
                SpecializationId = createDto.SpecializationId,
                Email = createDto.Email,
                ContactNumber = createDto.ContactNumber,
                Qualifications = createDto.Qualifications,
                ExperienceYears = createDto.ExperienceYears,
                Details = createDto.Details,
                HospitalName = createDto.HospitalName,
                Address = createDto.Address,
                IsActive = true,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            var doctorResponseDto = new DoctorResponseDto
            {
                DoctorId = 1,
                FullName = createDto.FullName,
                SpecializationId = createDto.SpecializationId,
                SpecializationName = "Cardiology",
                Email = createDto.Email,
                ContactNumber = createDto.ContactNumber,
                Qualifications = createDto.Qualifications,
                ExperienceYears = createDto.ExperienceYears,
                Details = createDto.Details,
                HospitalName = createDto.HospitalName,
                Address = createDto.Address,
                IsActive = true,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _mockSpecializationRepository.Setup(x => x.ExistsAsync(createDto.SpecializationId))
                .ReturnsAsync(true);
            _mockDoctorRepository.Setup(x => x.EmailExistsAsync(createDto.Email, null))
                .ReturnsAsync(false);
            _mockDoctorRepository.Setup(x => x.CreateAsync(It.IsAny<Doctor>()))
                .ReturnsAsync(createdDoctor);
            _mockDoctorRepository.Setup(x => x.GetDoctorWithSpecializationAsync(createdDoctor.DoctorId))
                .ReturnsAsync(doctorResponseDto);

            // Act
            var result = await _service.CreateDoctorAsync(createDto);

            // Assert
            result.Should().NotBeNull();
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Doctor created successfully");
            result.Data.Should().NotBeNull();
            result.Data!.FullName.Should().Be(createDto.FullName);
            result.Data!.Email.Should().Be(createDto.Email);
        }

        [Fact]
        public async Task CreateDoctorAsync_WhenEmailExists_ReturnsFailureResponse()
        {
            // Arrange
            var createDto = new CreateDoctorDto
            {
                FullName = "Dr. New Doctor",
                SpecializationId = 1,
                Email = "existing@example.com", // Duplicate email
                ContactNumber = "1234567890",
                Qualifications = "MBBS",
                ExperienceYears = 5
            };

            _mockSpecializationRepository.Setup(x => x.ExistsAsync(createDto.SpecializationId))
                .ReturnsAsync(true);
            _mockDoctorRepository.Setup(x => x.EmailExistsAsync(createDto.Email, null))
                .ReturnsAsync(true);

            // Act
            var result = await _service.CreateDoctorAsync(createDto);

            // Assert
            result.Should().NotBeNull();
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Email address already exists");
            result.Data.Should().BeNull();
        }

        [Fact]
        public async Task UpdateDoctorAsync_WithValidData_ReturnsUpdatedDoctor()
        {
            // Arrange
            var updateDto = new UpdateDoctorDto
            {
                DoctorId = 1,
                FullName = "Dr. Updated Name",
                SpecializationId = 2,
                Email = "updated@example.com",
                ContactNumber = "0987654321",
                Qualifications = "MBBS, MD",
                ExperienceYears = 12,
                Details = "Updated details",
                HospitalName = "Updated Hospital",
                Address = "Updated Address",
                IsActive = true
            };

            var existingDoctor = new Doctor
            {
                DoctorId = updateDto.DoctorId,
                FullName = "Dr. Old Name",
                SpecializationId = 1,
                Email = "old@example.com",
                ContactNumber = "1234567890",
                Qualifications = "MBBS",
                ExperienceYears = 10,
                IsActive = true,
                CreatedAt = DateTime.Now.AddDays(-30),
                UpdatedAt = DateTime.Now.AddDays(-1)
            };

            var updatedDoctorResponse = new DoctorResponseDto
            {
                DoctorId = updateDto.DoctorId,
                FullName = updateDto.FullName,
                SpecializationId = updateDto.SpecializationId,
                SpecializationName = "Neurology",
                Email = updateDto.Email,
                ContactNumber = updateDto.ContactNumber,
                Qualifications = updateDto.Qualifications,
                ExperienceYears = updateDto.ExperienceYears,
                Details = updateDto.Details,
                HospitalName = updateDto.HospitalName,
                Address = updateDto.Address,
                IsActive = updateDto.IsActive,
                CreatedAt = DateTime.Now.AddDays(-30),
                UpdatedAt = DateTime.Now
            };

            _mockDoctorRepository.Setup(x => x.ExistsAsync(updateDto.DoctorId))
                .ReturnsAsync(true);
            _mockSpecializationRepository.Setup(x => x.ExistsAsync(updateDto.SpecializationId))
                .ReturnsAsync(true);
            _mockDoctorRepository.Setup(x => x.EmailExistsAsync(updateDto.Email, updateDto.DoctorId))
                .ReturnsAsync(false);
            _mockDoctorRepository.Setup(x => x.GetByIdAsync(updateDto.DoctorId))
                .ReturnsAsync(existingDoctor);
            _mockDoctorRepository.Setup(x => x.UpdateAsync(It.IsAny<Doctor>()))
                .ReturnsAsync(existingDoctor);
            _mockDoctorRepository.Setup(x => x.GetDoctorWithSpecializationAsync(updateDto.DoctorId))
                .ReturnsAsync(updatedDoctorResponse);

            // Act
            var result = await _service.UpdateDoctorAsync(updateDto);

            // Assert
            result.Should().NotBeNull();
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Doctor updated successfully");
            result.Data.Should().NotBeNull();
            result.Data!.FullName.Should().Be(updateDto.FullName);
            result.Data!.Email.Should().Be(updateDto.Email);
        }

        [Fact]
        public async Task DeleteDoctorAsync_WhenDoctorExists_ReturnsSuccessResponse()
        {
            // Arrange
            var doctorId = 1;
            _mockDoctorRepository.Setup(x => x.ExistsAsync(doctorId))
                .ReturnsAsync(true);
            _mockDoctorRepository.Setup(x => x.DeleteAsync(doctorId))
                .ReturnsAsync(true);

            // Act
            var result = await _service.DeleteDoctorAsync(doctorId);

            // Assert
            result.Should().NotBeNull();
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Doctor deleted successfully");
            result.Data.Should().BeTrue();
        }

        [Fact]
        public async Task DeleteDoctorAsync_WhenDoctorNotFound_ReturnsFailureResponse()
        {
            // Arrange
            var doctorId = 999;
            _mockDoctorRepository.Setup(x => x.ExistsAsync(doctorId))
                .ReturnsAsync(false);

            // Act
            var result = await _service.DeleteDoctorAsync(doctorId);

            // Assert
            result.Should().NotBeNull();
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Doctor not found");
            result.Data.Should().BeFalse();
        }

        [Fact]
        public async Task SearchDoctorsAsync_WithSearchTerm_ReturnsMatchingDoctors()
        {
            // Arrange
            var searchTerm = "John";
            var doctors = new List<Doctor>
            {
                new Doctor
                {
                    DoctorId = 1,
                    FullName = "Dr. John Doe",
                    SpecializationId = 1,
                    SpecializationName = "Cardiology",
                    Email = "john@example.com",
                    ContactNumber = "1234567890",
                    Qualifications = "MBBS, MD",
                    ExperienceYears = 10,
                    IsActive = true,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                }
            };

            _mockDoctorRepository.Setup(x => x.SearchDoctorsAsync(searchTerm, null))
                .ReturnsAsync(doctors);

            // Act
            var result = await _service.SearchDoctorsAsync(searchTerm);

            // Assert
            result.Should().NotBeNull();
            result.Success.Should().BeTrue();
            result.Data.Should().NotBeNull();
            result.Data.Should().HaveCount(1);
            result.Data!.First().FullName.Should().Contain("John");
        }

        [Fact]
        public async Task SearchDoctorsAsync_WithSpecializationFilter_ReturnsFilteredDoctors()
        {
            // Arrange
            var searchTerm = "";
            var specializationId = 1;
            var doctors = new List<Doctor>
            {
                new Doctor
                {
                    DoctorId = 1,
                    FullName = "Dr. John Doe",
                    SpecializationId = specializationId,
                    SpecializationName = "Cardiology",
                    Email = "john@example.com",
                    ContactNumber = "1234567890",
                    Qualifications = "MBBS, MD",
                    ExperienceYears = 10,
                    IsActive = true,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                }
            };

            _mockDoctorRepository.Setup(x => x.SearchDoctorsAsync(searchTerm, specializationId))
                .ReturnsAsync(doctors);

            // Act
            var result = await _service.SearchDoctorsAsync(searchTerm, specializationId);

            // Assert
            result.Should().NotBeNull();
            result.Success.Should().BeTrue();
            result.Data.Should().NotBeNull();
            result.Data.Should().HaveCount(1);
            result.Data!.First().SpecializationId.Should().Be(specializationId);
        }

        [Fact]
        public async Task GetDoctorsBySpecializationAsync_WhenSpecializationExists_ReturnsDoctors()
        {
            // Arrange
            var specializationId = 1;
            var doctors = new List<Doctor>
            {
                new Doctor
                {
                    DoctorId = 1,
                    FullName = "Dr. John Doe",
                    SpecializationId = specializationId,
                    SpecializationName = "Cardiology",
                    Email = "john@example.com",
                    ContactNumber = "1234567890",
                    Qualifications = "MBBS, MD",
                    ExperienceYears = 10,
                    IsActive = true,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                },
                new Doctor
                {
                    DoctorId = 2,
                    FullName = "Dr. Jane Smith",
                    SpecializationId = specializationId,
                    SpecializationName = "Cardiology",
                    Email = "jane@example.com",
                    ContactNumber = "0987654321",
                    Qualifications = "MBBS, MS",
                    ExperienceYears = 8,
                    IsActive = true,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                }
            };

            _mockDoctorRepository.Setup(x => x.GetDoctorsBySpecializationAsync(specializationId))
                .ReturnsAsync(doctors);

            // Act
            var result = await _service.GetDoctorsBySpecializationAsync(specializationId);

            // Assert
            result.Should().NotBeNull();
            result.Success.Should().BeTrue();
            result.Data.Should().NotBeNull();
            result.Data.Should().HaveCount(2);
            result.Data!.All(d => d.SpecializationId == specializationId).Should().BeTrue();
        }

        [Fact]
        public async Task GetDoctorsWithStatsAsync_WhenSuccessful_ReturnsDoctorsWithStatistics()
        {
            // Arrange
            var doctorsWithStats = new List<dynamic>
            {
                new { DoctorId = 1, FullName = "Dr. John Doe", TotalAppointments = 50, AvailableSlots = 10 },
                new { DoctorId = 2, FullName = "Dr. Jane Smith", TotalAppointments = 30, AvailableSlots = 15 }
            };

            _mockDoctorRepository.Setup(x => x.GetDoctorsWithScheduleStatsAsync())
                .ReturnsAsync(doctorsWithStats);

            // Act
            var result = await _service.GetDoctorsWithStatsAsync();

            // Assert
            result.Should().NotBeNull();
            result.Success.Should().BeTrue();
            result.Data.Should().NotBeNull();
            result.Data.Should().HaveCount(2);
        }
    }
}
