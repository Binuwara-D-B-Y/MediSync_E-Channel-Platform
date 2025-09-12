using ClinicWebApp.Models;
using ClinicWebApp.Models.DTOs;

namespace ClinicWebApp.Services.Interfaces
{
	public interface IJwtService
	{
		AuthResponseDto GenerateToken(Patient patient);
	}
}

