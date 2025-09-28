using Backend.Controllers;
using Backend.Models.DTOs;
using Backend.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace Backend.Tests
{
    public class DoctorsControllerTests
    {
        private readonly Mock<IDoctorService> _mockDoctorService;
        private readonly Mock<ILogger<DoctorsController>> _mockLogger;
        private readonly DoctorsController _controller;

        public DoctorsControllerTests()
        {
            _mockDoctorService = new Mock<IDoctorService>();
            _mockLogger = new Mock<ILogger<DoctorsController>>();
            _controller = new DoctorsController(_mockDoctorService.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task GetDoctors_WhenSuccessful_ReturnsOkResult()
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
                }
            };

            var response = ApiResponseDto<IEnumerable<DoctorResponseDto>>.Ok(doctors, "Doctors retrieved successfully");

            _mockDoctorService.Setup(x => x.GetActiveDoctorsAsync())
                .ReturnsAsync(response);

            // Act
            var result = await _controller.GetDoctors();

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(response);
        }

        [Fact]
        public async Task GetDoctors_WhenExceptionThrown_ReturnsInternalServerError()
        {
            // Arrange
            _mockDoctorService.Setup(x => x.GetActiveDoctorsAsync())
                .ThrowsAsync(new Exception("Database connection failed"));

            // Act
            var result = await _controller.GetDoctors();

            // Assert
            result.Should().BeOfType<ObjectResult>();
            var objectResult = result as ObjectResult;
            objectResult!.StatusCode.Should().Be(500);
            
            // Verify logging was called
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Error,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Error retrieving doctors")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public async Task GetDoctor_WhenDoctorExists_ReturnsOkResult()
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

            var response = ApiResponseDto<DoctorResponseDto>.Ok(doctor, "Doctor retrieved successfully");

            _mockDoctorService.Setup(x => x.GetDoctorByIdAsync(doctorId))
                .ReturnsAsync(response);

            // Act
            var result = await _controller.GetDoctor(doctorId);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(response);
        }

        [Fact]
        public async Task GetDoctor_WhenDoctorNotFound_ReturnsNotFound()
        {
            // Arrange
            var doctorId = 999;
            var response = ApiResponseDto<DoctorResponseDto>.Fail("Doctor not found");

            _mockDoctorService.Setup(x => x.GetDoctorByIdAsync(doctorId))
                .ReturnsAsync(response);

            // Act
            var result = await _controller.GetDoctor(doctorId);

            // Assert
            result.Should().BeOfType<NotFoundObjectResult>();
            var notFoundResult = result as NotFoundObjectResult;
            notFoundResult!.Value.Should().BeEquivalentTo(response);
        }

        [Fact]
        public async Task GetDoctor_WhenExceptionThrown_ReturnsInternalServerError()
        {
            // Arrange
            var doctorId = 1;
            _mockDoctorService.Setup(x => x.GetDoctorByIdAsync(doctorId))
                .ThrowsAsync(new Exception("Database connection failed"));

            // Act
            var result = await _controller.GetDoctor(doctorId);

            // Assert
            result.Should().BeOfType<ObjectResult>();
            var objectResult = result as ObjectResult;
            objectResult!.StatusCode.Should().Be(500);
            
            // Verify logging was called with correct doctor ID
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Error,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains($"Error retrieving doctor with ID: {doctorId}")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public async Task SearchDoctors_WithQueryAndSpecialization_ReturnsOkResult()
        {
            // Arrange
            var query = "John";
            var specializationId = 1;
            var doctors = new List<DoctorResponseDto>
            {
                new DoctorResponseDto
                {
                    DoctorId = 1,
                    FullName = "Dr. John Doe",
                    SpecializationId = specializationId,
                    SpecializationName = "Cardiology",
                    Email = "john@example.com",
                    ContactNumber = "1234567890",
                    Qualifications = "MBBS, MD",
                    ExperienceYears = 10,
                    IsActive = true
                }
            };

            var response = ApiResponseDto<IEnumerable<DoctorResponseDto>>.Ok(doctors, "Doctors found");

            _mockDoctorService.Setup(x => x.SearchDoctorsAsync(query, specializationId))
                .ReturnsAsync(response);

            // Act
            var result = await _controller.SearchDoctors(query, specializationId);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(response);
        }

        [Fact]
        public async Task SearchDoctors_WithNullParameters_ReturnsOkResult()
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
                }
            };

            var response = ApiResponseDto<IEnumerable<DoctorResponseDto>>.Ok(doctors, "All doctors retrieved");

            _mockDoctorService.Setup(x => x.SearchDoctorsAsync(null, null))
                .ReturnsAsync(response);

            // Act
            var result = await _controller.SearchDoctors();

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(response);
        }

        [Fact]
        public async Task SearchDoctors_WhenExceptionThrown_ReturnsInternalServerError()
        {
            // Arrange
            _mockDoctorService.Setup(x => x.SearchDoctorsAsync(It.IsAny<string>(), It.IsAny<int?>()))
                .ThrowsAsync(new Exception("Search failed"));

            // Act
            var result = await _controller.SearchDoctors("test");

            // Assert
            result.Should().BeOfType<ObjectResult>();
            var objectResult = result as ObjectResult;
            objectResult!.StatusCode.Should().Be(500);
            
            // Verify logging was called
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Error,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Error searching doctors")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public async Task GetDoctorsBySpecialization_WhenSuccessful_ReturnsOkResult()
        {
            // Arrange
            var specializationId = 1;
            var doctors = new List<DoctorResponseDto>
            {
                new DoctorResponseDto
                {
                    DoctorId = 1,
                    FullName = "Dr. John Doe",
                    SpecializationId = specializationId,
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
                    SpecializationId = specializationId,
                    SpecializationName = "Cardiology",
                    Email = "jane@example.com",
                    ContactNumber = "0987654321",
                    Qualifications = "MBBS, MS",
                    ExperienceYears = 8,
                    IsActive = true
                }
            };

            var response = ApiResponseDto<IEnumerable<DoctorResponseDto>>.Ok(doctors, "Doctors by specialization retrieved");

            _mockDoctorService.Setup(x => x.GetDoctorsBySpecializationAsync(specializationId))
                .ReturnsAsync(response);

            // Act
            var result = await _controller.GetDoctorsBySpecialization(specializationId);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(response);
        }

        [Fact]
        public async Task GetDoctorsBySpecialization_WhenExceptionThrown_ReturnsInternalServerError()
        {
            // Arrange
            var specializationId = 1;
            _mockDoctorService.Setup(x => x.GetDoctorsBySpecializationAsync(specializationId))
                .ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _controller.GetDoctorsBySpecialization(specializationId);

            // Assert
            result.Should().BeOfType<ObjectResult>();
            var objectResult = result as ObjectResult;
            objectResult!.StatusCode.Should().Be(500);
            
            // Verify logging was called
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Error,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Error retrieving doctors by specialization")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Theory]
        [InlineData(0)]
        [InlineData(-1)]
        [InlineData(999)]
        public async Task GetDoctor_WithInvalidId_CallsServiceCorrectly(int invalidId)
        {
            // Arrange
            var response = ApiResponseDto<DoctorResponseDto>.Fail("Doctor not found");
            _mockDoctorService.Setup(x => x.GetDoctorByIdAsync(invalidId))
                .ReturnsAsync(response);

            // Act
            var result = await _controller.GetDoctor(invalidId);

            // Assert
            result.Should().BeOfType<NotFoundObjectResult>();
            _mockDoctorService.Verify(x => x.GetDoctorByIdAsync(invalidId), Times.Once);
        }

        [Theory]
        [InlineData(0)]
        [InlineData(-1)]
        [InlineData(999)]
        public async Task GetDoctorsBySpecialization_WithInvalidSpecializationId_CallsServiceCorrectly(int invalidSpecializationId)
        {
            // Arrange
            var doctors = new List<DoctorResponseDto>();
            var response = ApiResponseDto<IEnumerable<DoctorResponseDto>>.Ok(doctors, "No doctors found for this specialization");

            _mockDoctorService.Setup(x => x.GetDoctorsBySpecializationAsync(invalidSpecializationId))
                .ReturnsAsync(response);

            // Act
            var result = await _controller.GetDoctorsBySpecialization(invalidSpecializationId);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            _mockDoctorService.Verify(x => x.GetDoctorsBySpecializationAsync(invalidSpecializationId), Times.Once);
        }
    }
}
