using System;
using System.Threading.Tasks;
using ClinicWebApp.Models;

namespace ClinicWebApp.Repositories
{
	public interface IPatientRepository
	{
		Task<bool> EmailExistsAsync(string email);
		Task<Patient?> GetByEmailAsync(string email);
		Task<Patient?> GetByIdAsync(Guid id);
		Task<Patient?> GetByResetTokenAsync(string token);
		Task AddAsync(Patient patient);
		Task UpdateAsync(Patient patient);
		Task DeleteAsync(Patient patient);
		Task SaveChangesAsync();
	}
}

