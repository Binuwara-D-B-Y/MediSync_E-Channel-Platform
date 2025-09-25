using System;
using System.Threading.Tasks;
using Backend.Models.DTOs;

namespace ClinicWebApp.Services.Interfaces
{
	public interface IPatientService
	{
		Task<PatientDto> UpdateProfileAsync(Guid patientId, UpdateProfileDto dto);
		Task DeleteAccountAsync(Guid patientId, bool confirm);
	}
}

