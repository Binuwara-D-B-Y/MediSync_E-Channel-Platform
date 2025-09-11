using Backend.Controllers;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

namespace Backend.Tests
{
    public class ControllersTests
    {
        private readonly WebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public ControllersTests()
        {
            // Set test env vars before starting the host so Program can build without contacting MySQL
            Environment.SetEnvironmentVariable("DB_PASSWORD", "test_password");
            Environment.SetEnvironmentVariable("USE_INMEMORY_FOR_TESTS", "true");

            // Create a new factory instance after setting env vars, then replace DB with InMemory
            var dbName = Guid.NewGuid().ToString();
            _factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
            {
                // Ensure the app sees the Testing environment and an in-memory flag early
                builder.UseEnvironment("Testing");
                builder.ConfigureAppConfiguration((context, config) =>
                {
                    var dict = new Dictionary<string, string?> { { "USE_INMEMORY_FOR_TESTS", "true" } };
                    config.AddInMemoryCollection(dict);
                });

                builder.ConfigureTestServices(services =>
                {
                    // Remove any existing AppDbContext registrations and replace with an isolated InMemory DB
                    var toRemove = services.Where(d => d.ServiceType == typeof(DbContextOptions<AppDbContext>) || d.ServiceType == typeof(AppDbContext)).ToList();
                    foreach (var d in toRemove) services.Remove(d);

                    services.AddDbContext<AppDbContext>(options =>
                        options.UseInMemoryDatabase(dbName));
                });
            });

            _client = _factory.CreateClient();
        }

        private async Task SeedDataAsync(AppDbContext context)
        {
            // Ensure a clean database state for this test run
            await context.Database.EnsureDeletedAsync();
            await context.Database.EnsureCreatedAsync();

            context.Doctors.AddRange(
                new Doctor { FullName = "Alice", Specialization = "Cardiology", Details = "Expert in heart" },
                new Doctor { FullName = "Bob", Specialization = "Neurology", Details = "Brain specialist" },
                new Doctor { FullName = "Charlie", Specialization = "Cardiology", Details = "Heart surgeon" }
            );
            await context.SaveChangesAsync();
        }

        [Fact]
        public async Task GetAllDoctors_NoFilters_ReturnsAllDoctors()
        {
            using var scope = _factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await SeedDataAsync(context);

            var response = await _client.GetAsync("/api/doctors");

            response.EnsureSuccessStatusCode();
            var doctors = await response.Content.ReadFromJsonAsync<List<Doctor>>();
            Assert.NotNull(doctors);
            Assert.Equal(3, doctors.Count);
        }

        [Theory]
        [InlineData("Alice", 1)]
        [InlineData("Bob", 1)]
        public async Task GetAllDoctors_WithNameFilter_ReturnsFilteredDoctors(string name, int expectedCount)
        {
            using var scope = _factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await SeedDataAsync(context);

            var response = await _client.GetAsync($"/api/doctors?name={Uri.EscapeDataString(name)}");

            response.EnsureSuccessStatusCode();
            var doctors = await response.Content.ReadFromJsonAsync<List<Doctor>>();
            Assert.Equal(expectedCount, doctors.Count);
            Assert.Contains(doctors!, d => d.FullName.Contains(name));
        }

        [Theory]
        [InlineData("Cardiology", 2)]
        [InlineData("Neurology", 1)]
        public async Task GetAllDoctors_WithSpecializationFilter_ReturnsFilteredDoctors(string spec, int expectedCount)
        {
            using var scope = _factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await SeedDataAsync(context);

            var response = await _client.GetAsync($"/api/doctors?specialization={Uri.EscapeDataString(spec)}");

            response.EnsureSuccessStatusCode();
            var doctors = await response.Content.ReadFromJsonAsync<List<Doctor>>();
            Assert.Equal(expectedCount, doctors.Count);
            Assert.All(doctors!, d => Assert.Equal(spec, d.Specialization));
        }

        [Fact]
        public async Task GetAllDoctors_WithInvalidDate_ReturnsAllDoctors()
        {
            using var scope = _factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await SeedDataAsync(context);

            var response = await _client.GetAsync("/api/doctors?date=2025-01-01");

            response.EnsureSuccessStatusCode();
            var doctors = await response.Content.ReadFromJsonAsync<List<Doctor>>();
            Assert.Equal(3, doctors.Count);
        }

        [Fact]
        public async Task GetAllSpecializations_ReturnsDistinctOrderedList()
        {
            using var scope = _factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await SeedDataAsync(context);

            var response = await _client.GetAsync("/api/specializations");

            response.EnsureSuccessStatusCode();
            var specs = await response.Content.ReadFromJsonAsync<List<string>>();
            Assert.NotNull(specs);
            Assert.Equal(2, specs.Count);
            Assert.Equal(new[] { "Cardiology", "Neurology" }, specs);
        }

        [Fact]
        public async Task GetAllSpecializations_NoDoctors_ReturnsEmptyList()
        {
            var response = await _client.GetAsync("/api/specializations");

            response.EnsureSuccessStatusCode();
            var specs = await response.Content.ReadFromJsonAsync<List<string>>();
            Assert.Empty(specs!);
        }

        [Fact]
        public async Task GetAllDoctors_InvalidRoute_ReturnsNotFound()
        {
            var response = await _client.GetAsync("/api/doctors/invalid");

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }
    }
}