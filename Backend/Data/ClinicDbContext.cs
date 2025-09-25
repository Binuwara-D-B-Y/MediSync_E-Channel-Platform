using ClinicWebApp.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicWebApp.Data
{
	public sealed class ClinicDbContext : DbContext
	{
		public ClinicDbContext(DbContextOptions<ClinicDbContext> options) : base(options)
		{
		}

		public DbSet<Patient> Patients => Set<Patient>();

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<Patient>(entity =>
			{
				entity.ToTable("Patients");
				entity.HasKey(p => p.Id);
				entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
				entity.Property(p => p.Email).IsRequired().HasMaxLength(256);
				entity.Property(p => p.Phone).IsRequired().HasMaxLength(30);
				entity.Property(p => p.Address).HasMaxLength(400);
				entity.Property(p => p.Nic).HasMaxLength(50);
				entity.Property(p => p.PasswordHash).IsRequired();
				entity.Property(p => p.PasswordResetToken).HasMaxLength(200);
				entity.Property(p => p.PasswordResetTokenExpiresUtc);
				entity.Property(p => p.CreatedUtc).IsRequired();

				entity.HasIndex(p => p.Email).IsUnique();
			});
		}
	}
}

