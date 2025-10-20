using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Backend.Repositories;
using Backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FavoritesController : ControllerBase
    {
        private readonly IFavoriteRepository _favoriteRepository;
        private readonly AppDbContext _context;

        public FavoritesController(IFavoriteRepository favoriteRepository, AppDbContext context)
        {
            _favoriteRepository = favoriteRepository;
            _context = context;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine($"Raw user claim: {userIdClaim}");
            
            if (int.TryParse(userIdClaim, out int userId))
            {
                Console.WriteLine($"Parsed user ID: {userId}");
                return userId;
            }
            
            Console.WriteLine($"Failed to parse user ID from claim: {userIdClaim}");
            throw new UnauthorizedAccessException($"Invalid user token. Claim value: {userIdClaim}");
        }

        [HttpGet]
        public async Task<IActionResult> GetFavorites()
        {
            try
            {
                var userId = GetUserId();
                Console.WriteLine($"Getting favorites for user ID: {userId}");
                
                // Direct database check
                var favorites = await _context.Favorites
                    .Include(f => f.Doctor)
                    .Where(f => f.PatientId == userId)
                    .Select(f => new {
                        favoriteId = f.FavoriteId,
                        doctor = new {
                            doctorId = f.Doctor.DoctorId,
                            fullName = f.Doctor.FullName,
                            specialization = f.Doctor.Specialization,
                            qualification = f.Doctor.Qualification,
                            email = f.Doctor.Email
                        }
                    })
                    .ToListAsync();
                    
                Console.WriteLine($"Found {favorites.Count} favorites");
                return Ok(favorites);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting favorites: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message, stackTrace = ex.StackTrace });
            }
        }

        [HttpPost("{doctorId}")]
        public async Task<IActionResult> AddFavorite(int doctorId)
        {
            try
            {
                var userId = GetUserId();
                Console.WriteLine($"Adding favorite: UserId={userId}, DoctorId={doctorId}");
                await _favoriteRepository.AddFavoriteAsync(userId, doctorId);
                Console.WriteLine($"Successfully added favorite for user {userId}");
                return Ok(new { message = "Added to favorites", userId = userId, doctorId = doctorId });
            }
            catch (UnauthorizedAccessException ex)
            {
                Console.WriteLine($"Unauthorized: {ex.Message}");
                return Unauthorized(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"Invalid operation: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding favorite: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpDelete("{doctorId}")]
        public async Task<IActionResult> RemoveFavorite(int doctorId)
        {
            try
            {
                var userId = GetUserId();
                await _favoriteRepository.RemoveFavoriteAsync(userId, doctorId);
                return Ok(new { message = "Removed from favorites" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpGet("check/{doctorId}")]
        public async Task<IActionResult> CheckFavorite(int doctorId)
        {
            try
            {
                var userId = GetUserId();
                var isFavorite = await _favoriteRepository.IsFavoriteAsync(userId, doctorId);
                return Ok(new { isFavorite });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpGet("debug")]
        [AllowAnonymous]
        public async Task<IActionResult> DebugFavorites()
        {
            try
            {
                // Test without auth first
                var allFavs = await _context.Favorites.Include(f => f.Doctor).ToListAsync();
                var userClaims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
                
                return Ok(new { 
                    totalFavoritesInDb = allFavs.Count,
                    isAuthenticated = User.Identity?.IsAuthenticated,
                    userClaims = userClaims,
                    favorites = allFavs.Select(f => new {
                        favoriteId = f.FavoriteId,
                        patientId = f.PatientId,
                        doctorId = f.DoctorId,
                        doctorName = f.Doctor?.FullName
                    })
                });
            }
            catch (Exception ex)
            {
                return Ok(new { error = ex.Message, stackTrace = ex.StackTrace });
            }
        }
    }
}