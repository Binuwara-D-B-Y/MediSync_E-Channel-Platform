using Backend.Models;
using Backend.Models.DTOs;
using Backend.Repositories;
using Backend.Services;
using FluentAssertions;
using Moq;

namespace Backend.Tests.Services
{
    public class SpecializationServiceTests
    {
        private readonly Mock<ISpecializationRepository> _repoMock = new();
        private readonly ISpecializationService _service;

        public SpecializationServiceTests()
        {
            _service = new SpecializationService(_repoMock.Object);
        }

        [Fact]
        public async Task CreateSpecialization_Should_Create_When_Name_Unique()
        {
            // Arrange
            var dto = new CreateSpecializationDto { Name = "Cardiology", Description = "Heart" };
            _repoMock.Setup(r => r.NameExistsAsync("Cardiology", null)).ReturnsAsync(false);
            _repoMock.Setup(r => r.NameExistsAsync("Cardiology")).ReturnsAsync(false);
            _repoMock.Setup(r => r.CreateAsync(It.IsAny<Specialization>()))
                .ReturnsAsync((Specialization s) => { s.SpecializationId = 1; return s; });

            // Act
            var res = await _service.CreateSpecializationAsync(dto);

            // Assert
            res.Success.Should().BeTrue();
            res.Data.Should().NotBeNull();
            res.Data!.Name.Should().Be("Cardiology");
            res.Data.SpecializationId.Should().Be(1);
        }

        [Fact]
        public async Task CreateSpecialization_Should_Fail_When_Name_Duplicate()
        {
            // Arrange
            var dto = new CreateSpecializationDto { Name = "Cardiology" };
            _repoMock.Setup(r => r.NameExistsAsync("Cardiology", null)).ReturnsAsync(true);
            _repoMock.Setup(r => r.NameExistsAsync("Cardiology")).ReturnsAsync(true);

            // Act
            var res = await _service.CreateSpecializationAsync(dto);

            // Assert
            res.Success.Should().BeFalse();
            res.Message.Should().Contain("already exists");
        }

        [Fact]
        public async Task GetAllSpecializations_Should_Return_Mapped_Dtos()
        {
            // Arrange
            _repoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Specialization>
            {
                new Specialization { SpecializationId = 1, Name = "Cardiology", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Specialization { SpecializationId = 2, Name = "Dermatology", IsActive = false, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            });

            // Act
            var res = await _service.GetAllSpecializationsAsync();

            // Assert
            res.Success.Should().BeTrue();
            res.Data.Should().NotBeNull();
            res.Data!.Count().Should().Be(2);
            res.Data!.First().Name.Should().Be("Cardiology");
        }
    }
}
