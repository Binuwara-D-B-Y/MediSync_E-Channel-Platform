using System.ComponentModel.DataAnnotations;
using System.Linq;
using Backend.Models;
using Xunit;

namespace Backend.Tests
{
    public class ModelsTests
    {
        [Fact]
        public void Doctor_Model_Requires_Fields()
        {
            // satisfy C# required members by initializing with empty strings
            var doc = new Doctor { FullName = string.Empty, Specialization = string.Empty, Details = string.Empty };
            var ctx = new ValidationContext(doc, null, null);
            var results = new System.Collections.Generic.List<ValidationResult>();
            var isValid = Validator.TryValidateObject(doc, ctx, results, true);
            Assert.False(isValid);
            Assert.Contains(results, r => r.MemberNames.Contains("FullName"));
            Assert.Contains(results, r => r.MemberNames.Contains("Specialization"));
            Assert.Contains(results, r => r.MemberNames.Contains("Details"));
        }

        [Fact]
        public void User_Model_Requires_Fields()
        {
            // satisfy C# required members by initializing with empty strings
            var user = new User { FullName = string.Empty, Email = string.Empty, PasswordHash = string.Empty, NIC = string.Empty, Role = UserRole.patient };
            var ctx = new ValidationContext(user, null, null);
            var results = new System.Collections.Generic.List<ValidationResult>();
            var isValid = Validator.TryValidateObject(user, ctx, results, true);
            Assert.False(isValid);
            Assert.Contains(results, r => r.MemberNames.Contains("FullName"));
            Assert.Contains(results, r => r.MemberNames.Contains("Email"));
            Assert.Contains(results, r => r.MemberNames.Contains("PasswordHash"));
        }
    }
}
