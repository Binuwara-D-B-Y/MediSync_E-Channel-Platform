using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ClinicWebApp.Models;
using ClinicWebApp.Models.DTOs;
using ClinicWebApp.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace ClinicWebApp.Services.Implementations
{
	public sealed class JwtService : IJwtService
	{
		private readonly string _issuer;
		private readonly string _audience;
		private readonly string _secret;
		private readonly int _expMinutes;

		public JwtService(IConfiguration config)
		{
			_issuer = config["Jwt:Issuer"] ?? "ClinicWebApp";
			_audience = config["Jwt:Audience"] ?? "ClinicWebAppAudience";
			_secret = config["Jwt:Secret"] ?? config["Jwt:SecretKey"] ?? throw new InvalidOperationException("JWT Secret not configured");
			_expMinutes = int.TryParse(config["Jwt:ExpMinutes"], out var minutes) ? minutes : 60;
		}

		public AuthResponseDto GenerateToken(Patient patient)
		{
			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret));
			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
			var expires = DateTime.UtcNow.AddMinutes(_expMinutes);

			var claims = new List<Claim>
			{
				new(JwtRegisteredClaimNames.Sub, patient.Id.ToString()),
				new(JwtRegisteredClaimNames.Email, patient.Email),
				new("name", patient.Name),
				new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
			};

			var token = new JwtSecurityToken(
				issuer: _issuer,
				audience: _audience,
				claims: claims,
				expires: expires,
				signingCredentials: creds
			);

			return new AuthResponseDto
			{
				Token = new JwtSecurityTokenHandler().WriteToken(token),
				ExpiresAtUtc = expires
			};
		}
	}
}

