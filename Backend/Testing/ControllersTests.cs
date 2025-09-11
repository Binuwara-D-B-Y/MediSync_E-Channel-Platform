using Backend.Controllers;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace Backend.Tests
{
    public class ControllersTests
    {
        private AppDbContext CreateInMemoryDb()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;
            var ctx = new AppDbContext(options);
            ctx.Database.EnsureCreated();
            return ctx;
        }

        [Fact]
        public async Task DoctorsController_GetAll_Returns_Doctors()
        {
            using var ctx = CreateInMemoryDb();
            ctx.Doctors.Add(new Doctor { FullName = "Alice", Specialization = "Cardiology", Details = "x" });
            ctx.Doctors.Add(new Doctor { FullName = "Bob", Specialization = "Neurology", Details = "y" });
            ctx.SaveChanges();

            var controller = new DoctorsController(ctx);
            var result = await controller.GetAll(null, null, null) as OkObjectResult;
            Assert.NotNull(result);
            var list = result.Value as System.Collections.Generic.List<Doctor>;
            Assert.NotNull(list);
            Assert.Equal(2, list.Count);
        }

        [Fact]
        public void SpecializationsController_GetAll_Returns_Distinct()
        {
            using var ctx = CreateInMemoryDb();
            ctx.Doctors.Add(new Doctor { FullName = "A", Specialization = "Cardiology", Details = "d" });
            ctx.Doctors.Add(new Doctor { FullName = "B", Specialization = "Cardiology", Details = "d" });
            ctx.Doctors.Add(new Doctor { FullName = "C", Specialization = "Neurology", Details = "d" });
            ctx.SaveChanges();

            var controller = new Backend.Controllers.SpecializationsController(ctx);
            var result = controller.GetAll() as OkObjectResult;
            Assert.NotNull(result);
            var list = result.Value as System.Collections.Generic.List<string>;
            Assert.NotNull(list);
            Assert.Contains("Cardiology", list);
            Assert.Contains("Neurology", list);
            Assert.Equal(2, list.Count);
        }
    }
}
