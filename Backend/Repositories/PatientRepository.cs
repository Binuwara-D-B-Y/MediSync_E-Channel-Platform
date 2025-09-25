using System;
using System.Threading.Tasks;
using ClinicWebApp.Data;
using ClinicWebApp.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicWebApp.Repositories
{
	public sealed class PatientRepository : IPatientRepository
	{
		private readonly ClinicDbContext _db;

		public PatientRepository(ClinicDbContext db)
		{
			_db = db;
		}

		public Task<bool> EmailExistsAsync(string email) => _db.Patients.AnyAsync(p => p.Email == email);

		public Task<Patient?> GetByEmailAsync(string email) => _db.Patients.FirstOrDefaultAsync(p => p.Email == email);

		public Task<Patient?> GetByIdAsync(Guid id) => _db.Patients.FirstOrDefaultAsync(p => p.Id == id);

		public Task<Patient?> GetByResetTokenAsync(string token) => _db.Patients.FirstOrDefaultAsync(p => p.PasswordResetToken == token && p.PasswordResetTokenExpiresUtc > DateTime.UtcNow);

		public async Task AddAsync(Patient patient)
		{
			await _db.Patients.AddAsync(patient);
		}

		public Task UpdateAsync(Patient patient)
		{
			_db.Patients.Update(patient);
			return Task.CompletedTask;
		}

		public Task DeleteAsync(Patient patient)
		{
			_db.Patients.Remove(patient);
			return Task.CompletedTask;
		}

		public Task SaveChangesAsync() => _db.SaveChangesAsync();
	}
}

