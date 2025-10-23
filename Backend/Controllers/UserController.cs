using Backend.Models.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
<<<<<<< HEAD
    // User account management - profile, password, transactions, account deletion
=======
>>>>>>> e3f9d7c471bef687e3cfe49d18c5cc1252e5b0ee
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

<<<<<<< HEAD
        // Helper to get current user ID from JWT token
=======
>>>>>>> e3f9d7c471bef687e3cfe49d18c5cc1252e5b0ee
        private int? GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            if (int.TryParse(userIdClaim, out int userId))
                return userId;
            return null;
        }

<<<<<<< HEAD
        // Get user profile info including name, email, phone, and profile image
=======
>>>>>>> e3f9d7c471bef687e3cfe49d18c5cc1252e5b0ee
        [HttpGet("profile")]
        public async Task<ActionResult<UserProfileDto>> GetProfile()
        {
            try
            {
                var userId = GetUserIdFromToken();
                if (userId == null) return Unauthorized(new { message = "Invalid token" });

                var profile = await _userService.GetProfileAsync(userId.Value);
                return Ok(profile);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving profile" });
            }
        }

<<<<<<< HEAD
        // Update profile details - handles image upload as base64 string
=======
>>>>>>> e3f9d7c471bef687e3cfe49d18c5cc1252e5b0ee
        [HttpPut("profile")]
        public async Task<ActionResult<UserProfileDto>> UpdateProfile([FromBody] UpdateProfileDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userId = GetUserIdFromToken();
                if (userId == null) return Unauthorized(new { message = "Invalid token" });

                var updatedProfile = await _userService.UpdateProfileAsync(userId.Value, request);
                return Ok(updatedProfile);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating profile" });
            }
        }

<<<<<<< HEAD
        // Change password - requires current password verification
=======
>>>>>>> e3f9d7c471bef687e3cfe49d18c5cc1252e5b0ee
        [HttpPost("change-password")]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto request)
        {
            Console.WriteLine("ChangePassword controller method called");
            try
            {
                if (!ModelState.IsValid)
                {
                    Console.WriteLine("ModelState is invalid");
                    return BadRequest(ModelState);
                }

                var userId = GetUserIdFromToken();
                Console.WriteLine($"Extracted userId: {userId}");
                if (userId == null) return Unauthorized(new { message = "Invalid token" });

                await _userService.ChangePasswordAsync(userId.Value, request);
                return Ok(new { message = "Password changed successfully" });
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine($"ArgumentException: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return StatusCode(500, new { message = "An error occurred while changing password" });
            }
        }

<<<<<<< HEAD
        // Permanently delete user account - this action cannot be undone
=======
>>>>>>> e3f9d7c471bef687e3cfe49d18c5cc1252e5b0ee
        [HttpDelete]
        public async Task<ActionResult> DeleteAccount()
        {
            try
            {
                var userId = GetUserIdFromToken();
                if (userId == null) return Unauthorized(new { message = "Invalid token" });

                await _userService.DeleteAccountAsync(userId.Value);
                return Ok(new { message = "Account deleted successfully" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting account" });
            }
        }

<<<<<<< HEAD
        // Get user's payment history for appointments
=======
>>>>>>> e3f9d7c471bef687e3cfe49d18c5cc1252e5b0ee
        [HttpGet("transactions")]
        public async Task<ActionResult<List<TransactionDto>>> GetTransactions()
        {
            try
            {
                var userId = GetUserIdFromToken();
                if (userId == null) return Unauthorized(new { message = "Invalid token" });

                var transactions = await _userService.GetTransactionsAsync(userId.Value);
                return Ok(transactions);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving transactions" });
            }
        }
    }
}
