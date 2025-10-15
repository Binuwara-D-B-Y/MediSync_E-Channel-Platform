using Xunit;

namespace MediSync.Tests
{
    public class ValidationTests
    {
        [Theory]
        [InlineData("", false)]
        [InlineData("   ", false)]
        [InlineData("John Doe", true)]
        [InlineData("John123", false)]
        public void ValidateName_ReturnsExpectedResult(string name, bool expected)
        {
            var result = ValidateName(name);
            Assert.Equal(expected, result);
        }

        [Theory]
        [InlineData("", false)]
        [InlineData("123456789012", true)]
        [InlineData("12345678901", false)]
        [InlineData("12345678901A", false)]
        public void ValidateNIC_ReturnsExpectedResult(string nic, bool expected)
        {
            var result = ValidateNIC(nic);
            Assert.Equal(expected, result);
        }

        [Theory]
        [InlineData("", false)]
        [InlineData("test@example.com", true)]
        [InlineData("invalid-email", false)]
        [InlineData("test@", false)]
        public void ValidateEmail_ReturnsExpectedResult(string email, bool expected)
        {
            var result = ValidateEmail(email);
            Assert.Equal(expected, result);
        }

        [Theory]
        [InlineData("", false)]
        [InlineData("0771234567", true)]
        [InlineData("077abc1234", false)]
        [InlineData("077-123-4567", false)]
        public void ValidateContact_ReturnsExpectedResult(string contact, bool expected)
        {
            var result = ValidateContact(contact);
            Assert.Equal(expected, result);
        }

        private bool ValidateName(string name)
        {
            if (string.IsNullOrWhiteSpace(name)) return false;
            return System.Text.RegularExpressions.Regex.IsMatch(name.Trim(), @"^[a-zA-Z\s]+$");
        }

        private bool ValidateNIC(string nic)
        {
            if (string.IsNullOrWhiteSpace(nic)) return false;
            return System.Text.RegularExpressions.Regex.IsMatch(nic.Trim(), @"^\d{12}$");
        }

        private bool ValidateEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return false;
            return System.Text.RegularExpressions.Regex.IsMatch(email.Trim(), @"^[^\s@]+@[^\s@]+\.[^\s@]+$");
        }

        private bool ValidateContact(string contact)
        {
            if (string.IsNullOrWhiteSpace(contact)) return false;
            return System.Text.RegularExpressions.Regex.IsMatch(contact.Trim(), @"^\d+$");
        }
    }
}