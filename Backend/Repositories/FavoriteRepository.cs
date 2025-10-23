using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    // Repository for managing patient's favorite doctors
    public class FavoriteRepository : IFavoriteRepository
    {
        private readonly AppDbContext _context;

        public FavoriteRepository(AppDbContext context)
        {
            _context = context;
        }

        // Get all favorites for a user, newest first
        public async Task<IEnumerable<Favorite>> GetUserFavoritesAsync(int userId)
        {
            return await _context.Favorites
                .Include(f => f.Doctor)
                .Where(f => f.PatientId == userId)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();
        }

        // Find a specific favorite record by user and doctor
        public async Task<Favorite?> GetFavoriteAsync(int userId, int doctorId)
        {
            return await _context.Favorites
                .FirstOrDefaultAsync(f => f.PatientId == userId && f.DoctorId == doctorId);
        }

        // Add doctor to favorites - prevents duplicates
        public async Task<Favorite> AddFavoriteAsync(int userId, int doctorId)
        {
            var existing = await GetFavoriteAsync(userId, doctorId);
            if (existing != null)
                throw new InvalidOperationException("Doctor is already in favorites");

            var favorite = new Favorite
            {
                PatientId = userId,
                DoctorId = doctorId
            };

            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();
            return favorite;
        }

        // Remove from favorites - safe to call even if not favorited
        public async Task RemoveFavoriteAsync(int userId, int doctorId)
        {
            var favorite = await GetFavoriteAsync(userId, doctorId);
            if (favorite != null)
            {
                _context.Favorites.Remove(favorite);
                await _context.SaveChangesAsync();
            }
        }

        // Quick check if doctor is in user's favorites (for UI state)
        public async Task<bool> IsFavoriteAsync(int userId, int doctorId)
        {
            return await _context.Favorites
                .AnyAsync(f => f.PatientId == userId && f.DoctorId == doctorId);
        }
    }
}