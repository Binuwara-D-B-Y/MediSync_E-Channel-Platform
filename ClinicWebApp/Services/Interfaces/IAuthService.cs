using System.Threading.Tasks;
using ClinicWebApp.Models;
using ClinicWebApp.Models.DTOs;

namespace ClinicWebApp.Services.Interfaces
{
	public interface IAuthService
	{
		Task<Patient> RegisterAsync(RegisterDto dto);
		Task<AuthResponseDto> LoginAsync(LoginDto dto);
		Task<string> RequestPasswordResetAsync(ForgotPasswordRequestDto dto);
		Task ResetPasswordAsync(ResetPasswordRequestDto dto);
	}
}

