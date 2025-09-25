using System;
using ClinicWebApp.Models;

namespace Backend.Models.DTOs
{
	public sealed class PatientDto
	{
		public Guid Id { get; init; }
		public string Name { get; init; } = string.Empty;
		public string Email { get; init; } = string.Empty;
		public string Phone { get; init; } = string.Empty;
		public string? Address { get; init; }
		public string? Nic { get; init; }

		public static PatientDto FromEntity(Patient p) => new()
		{
			Id = p.Id,
			Name = p.Name,
			Email = p.Email,
			Phone = p.Phone,
			Address = p.Address,
			Nic = p.Nic
		};
	}
}