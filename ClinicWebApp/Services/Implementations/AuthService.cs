using System;
using System.Threading.Tasks;
using ClinicWebApp.Models;
using ClinicWebApp.Models.DTOs;
using ClinicWebApp.Repositories;
using ClinicWebApp.Services.Interfaces;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace ClinicWebApp.Services.Implementations
{
	public sealed class AuthService : IAuthService
	{
		private readonly IPatientRepository _repo;
		private readonly IJwtService _jwtService;

		public AuthService(IPatientRepository repo, IJwtService jwtService)
		{
			_repo = repo;
			_jwtService = jwtService;
		}

		public async Task<Patient> RegisterAsync(RegisterDto dto)
		{
			if (await _repo.EmailExistsAsync(dto.Email.Trim().ToLowerInvariant()))
			{
				throw new InvalidOperationException("Email is already registered.");
			}

			var passwordHash = HashPassword(dto.Password);
			var patient = new Patient
			{
				Name = dto.Name.Trim(),
				Email = dto.Email.Trim().ToLowerInvariant(),
				Phone = dto.Phone.Trim(),
				Nic = dto.Nic.Trim(),
				PasswordHash = passwordHash
			};

			await _repo.AddAsync(patient);
			await _repo.SaveChangesAsync();
			return patient;
		}

		public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
		{
			var patient = await _repo.GetByEmailAsync(dto.Email.Trim().ToLowerInvariant());
			if (patient is null)
			{
				throw new UnauthorizedAccessException("Invalid email or password.");
			}

			if (!VerifyPassword(dto.Password, patient.PasswordHash))
			{
				throw new UnauthorizedAccessException("Invalid email or password.");
			}

			return _jwtService.GenerateToken(patient);
		}

		public async Task<string> RequestPasswordResetAsync(ForgotPasswordRequestDto dto)
		{
			var patient = await _repo.GetByEmailAsync(dto.Email.Trim().ToLowerInvariant());
			// Do not reveal existence; if not found, return generic message
			if (patient is null)
			{
				return "If the email exists, a reset link has been sent.";
			}
			var tokenBytes = System.Security.Cryptography.RandomNumberGenerator.GetBytes(32);
			var token = Convert.ToBase64String(tokenBytes);
			patient.PasswordResetToken = token;
			patient.PasswordResetTokenExpiresUtc = DateTime.UtcNow.AddMinutes(30);
			await _repo.UpdateAsync(patient);
			await _repo.SaveChangesAsync();
			// In real app, email the token link. Here we just return token for testing.
			return token;
		}

		public async Task ResetPasswordAsync(ResetPasswordRequestDto dto)
		{
			// Basic lookup by token
			// Since repository has no method for token, quick scan (not ideal for large datasets)
			var patient = await _repo.GetByEmailAsync("dummy"); // placeholder to satisfy compile; will replace below
			patient = null;
			// Workaround: re-query via context is not available here. Instead, require token to be email:token combined would be better.
			throw new NotImplementedException("Reset by token lookup not implemented in repository. Implement repo method or change token model.");
		}

		private static string HashPassword(string password)
		{
			// Simple PBKDF2 hash with random salt encoded into the result string as: {salt}.{hash} (Base64)
			var saltBytes = System.Security.Cryptography.RandomNumberGenerator.GetBytes(16);
			var hashBytes = KeyDerivation.Pbkdf2(password, saltBytes, KeyDerivationPrf.HMACSHA256, 100000, 32);
			return Convert.ToBase64String(saltBytes) + "." + Convert.ToBase64String(hashBytes);
		}

		private static bool VerifyPassword(string password, string stored)
		{
			var parts = stored.Split('.', 2);
			if (parts.Length != 2) return false;
			var salt = Convert.FromBase64String(parts[0]);
			var hash = Convert.FromBase64String(parts[1]);
			var computed = KeyDerivation.Pbkdf2(password, salt, KeyDerivationPrf.HMACSHA256, 100000, 32);
			return System.Security.Cryptography.CryptographicOperations.FixedTimeEquals(computed, hash);
		}
	}
}

