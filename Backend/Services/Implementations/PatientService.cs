using System;
using System.Threading.Tasks;
using Backend.Models.DTOs;
using ClinicWebApp.Repositories;
using ClinicWebApp.Services.Interfaces;

namespace ClinicWebApp.Services.Implementations
{
	public sealed class PatientService : IPatientService
	{
		private readonly IPatientRepository _repo;

		public PatientService(IPatientRepository repo)
		{
			_repo = repo;
		}

		public async Task<PatientDto> UpdateProfileAsync(Guid patientId, UpdateProfileDto dto)
		{
			var patient = await _repo.GetByIdAsync(patientId) ?? throw new KeyNotFoundException("Patient not found.");

			if (!string.IsNullOrWhiteSpace(dto.Phone)) patient.Phone = dto.Phone.Trim();
			patient.Address = string.IsNullOrWhiteSpace(dto.Address) ? null : dto.Address!.Trim();
			patient.Nic = string.IsNullOrWhiteSpace(dto.Nic) ? null : dto.Nic!.Trim();
			patient.UpdatedUtc = DateTime.UtcNow;

			await _repo.UpdateAsync(patient);
			await _repo.SaveChangesAsync();
			return PatientDto.FromEntity(patient);
		}

		public async Task DeleteAccountAsync(Guid patientId, bool confirm)
		{
			if (!confirm) throw new InvalidOperationException("Account deletion not confirmed.");
			var patient = await _repo.GetByIdAsync(patientId) ?? throw new KeyNotFoundException("Patient not found.");
			await _repo.DeleteAsync(patient);
			await _repo.SaveChangesAsync();
		}
	}
}

