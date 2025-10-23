using Backend.Models;
using Backend.Models.DTOs;
using Backend.Repositories;
using Microsoft.AspNetCore.Identity;

namespace Backend.Services
{
    // Business logic for user account operations
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly ITransactionRepository _transactionRepository;
        private readonly AuthService _authService;
        
        public UserService(
            IUserRepository userRepository,
            ITransactionRepository transactionRepository,
            AuthService authService)
        {
            _userRepository = userRepository;
            _transactionRepository = transactionRepository;
            _authService = authService;
        }

        // Get user profile and convert image to base64 for frontend display
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

        // Update profile with validation and image processing
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

            // Handle profile image upload
            if (!string.IsNullOrEmpty(request.ImageBase64))
            {
                try
                {
                    // Remove data URL prefix if present (data:image/jpeg;base64,)
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
                // Explicitly remove image if null is sent
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

        // Change password with current password verification
        public async Task ChangePasswordAsync(int userId, ChangePasswordDto request)
        {
            Console.WriteLine($"ChangePassword called for userId: {userId}");
            
            // Validate new password requirements
            if (request.NewPassword != request.ConfirmNewPassword)
                throw new ArgumentException("New passwords do not match.");

            if (request.NewPassword.Length < 6)
                throw new ArgumentException("New password must be at least 6 characters.");

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new ArgumentException("User not found");

            Console.WriteLine($"Found user: {user.Email}");

            // Verify current password before allowing change
            if (!_authService.VerifyPassword(request.CurrentPassword, user.PasswordHash))
                throw new ArgumentException("Current password is incorrect.");

            Console.WriteLine("Current password verified successfully");
            
            var oldHash = user.PasswordHash;
            user.PasswordHash = _authService.HashPassword(request.NewPassword);
            
            Console.WriteLine($"Password hash changed from {oldHash.Substring(0, 10)}... to {user.PasswordHash.Substring(0, 10)}...");
            
            await _userRepository.UpdateAsync(user);
            
            Console.WriteLine("Password update completed successfully");
        }

        // Permanently delete user account and all related data
        public async Task DeleteAccountAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new ArgumentException("User not found");

            await _userRepository.DeleteAsync(userId);
        }

        // Get payment history with doctor names for better user experience
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
