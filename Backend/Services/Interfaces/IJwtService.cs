using ClinicWebApp.Models;
using Backend.Models.DTOs;

namespace ClinicWebApp.Services.Interfaces
{
	public interface IJwtService
	{
		AuthResponseDto GenerateToken(Patient patient);
	}
}

