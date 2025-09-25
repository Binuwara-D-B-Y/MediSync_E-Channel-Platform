using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class DoctorService_Legacy
    {
        private readonly DoctorRepository_Legacy _repo;
        public DoctorService_Legacy(DoctorRepository_Legacy repo)
        {
            _repo = repo;
        }

        public async Task<List<Doctor>> GetDoctorsAsync(string? name, string? specialization, DateTime? date)
        {
            return await _repo.GetDoctorsAsync(name, specialization, date);
        }
    }
}
