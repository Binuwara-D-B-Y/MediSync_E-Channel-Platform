using Backend.Models;
using Backend.Models.DTOs;
using Backend.Repositories;
using Microsoft.AspNetCore.Identity;

namespace Backend.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly ITransactionRepository _transactionRepository;
        private readonly IPasswordHasher<User> _passwordHasher;
        public UserService(
            IUserRepository userRepository,
            ITransactionRepository transactionRepository,
            IPasswordHasher<User> passwordHasher)
        {
            _userRepository = userRepository;
            _transactionRepository = transactionRepository;
            _passwordHasher = passwordHasher;
        }

        public async Task<UserProfileDto> GetProfileAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new ArgumentException("User not found");

            return new UserProfileDto
            {
                Id = user.UserId,
                Name = user.FullName,
                Email = user.Email,
                Phone = user.ContactNumber ?? string.Empty,
                ImageBase64 = user.ProfileImage != null ? $"data:image/jpeg;base64,{Convert.ToBase64String(user.ProfileImage)}" : null
            };
        }

        public async Task<UserProfileDto> UpdateProfileAsync(int userId, UpdateProfileDto request)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new ArgumentException("User not found");

            if (string.IsNullOrWhiteSpace(request.Email))
                throw new ArgumentException("Email cannot be empty");

            user.FullName = request.Name;
            user.Email = request.Email;
            user.ContactNumber = request.Phone;

            if (!string.IsNullOrEmpty(request.ImageBase64))
            {
                try
                {
                    var base64Data = request.ImageBase64.Contains(",") ? request.ImageBase64.Split(',')[1] : request.ImageBase64;
                    user.ProfileImage = Convert.FromBase64String(base64Data);
                    if (user.ProfileImage.Length > 1024 * 1024)
                        throw new ArgumentException("Image size exceeds 1MB limit.");
                }
                catch (FormatException)
                {
                    throw new ArgumentException("Invalid image data format.");
                }
            }
            else if (request.ImageBase64 == null)
            {
                user.ProfileImage = null;
            }

            await _userRepository.UpdateAsync(user);

            return new UserProfileDto
            {
                Id = user.UserId,
                Name = user.FullName,
                Email = user.Email,
                Phone = user.ContactNumber ?? string.Empty,
                ImageBase64 = user.ProfileImage != null ? $"data:image/jpeg;base64,{Convert.ToBase64String(user.ProfileImage)}" : null
            };
        }

        public async Task ChangePasswordAsync(int userId, ChangePasswordDto request)
        {
            if (request.NewPassword != request.ConfirmNewPassword)
                throw new ArgumentException("New passwords do not match.");

            if (request.NewPassword.Length < 6)
                throw new ArgumentException("New password must be at least 6 characters.");

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new ArgumentException("User not found");

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.CurrentPassword);
            if (result != PasswordVerificationResult.Success)
                throw new ArgumentException("Current password is incorrect.");

            user.PasswordHash = _passwordHasher.HashPassword(user, request.NewPassword);
            await _userRepository.UpdateAsync(user);
        }

        public async Task DeleteAccountAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new ArgumentException("User not found");

            await _userRepository.DeleteAsync(userId);
        }

        public async Task<List<TransactionDto>> GetTransactionsAsync(int userId)
        {
            var transactions = await _transactionRepository.GetByPatientIdAsync(userId);
            return transactions.Select(t => new TransactionDto
            {
                Id = t.TransactionId,
                Date = t.PaymentDate,
                Amount = t.Amount,
                Description = t.Appointment != null
                    ? $"Consultation with Dr. {t.Appointment.DoctorSchedule?.Doctor?.FullName ?? "Unknown"}"
                    : "Payment Transaction"
            }).ToList();
        }
    }
}
