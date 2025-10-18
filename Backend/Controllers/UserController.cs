using Backend.Models.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
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

        private int? GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            if (int.TryParse(userIdClaim, out int userId))
                return userId;
            return null;
        }

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
