using System.Text;
using ClinicWebApp.Data;
using ClinicWebApp.Repositories;
using ClinicWebApp.Services.Implementations;
using ClinicWebApp.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// CORS for Vite dev server
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowVite",
		policy => policy
			.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
			.AllowAnyHeader()
			.AllowAnyMethod()
			.AllowCredentials());
});

builder.Services.AddDbContext<ClinicDbContext>(options =>
{
	var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
	options.UseSqlServer(connectionString);
});

builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPatientService, PatientService>();

var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "ClinicWebApp";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "ClinicWebAppAudience";
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? builder.Configuration["Jwt:SecretKey"] ?? "";

builder.Services
	.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddJwtBearer(options =>
	{
		options.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuer = true,
			ValidateAudience = true,
			ValidateIssuerSigningKey = true,
			ValidateLifetime = true,
			ValidIssuer = jwtIssuer,
			ValidAudience = jwtAudience,
			IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
			ClockSkew = TimeSpan.FromSeconds(30)
		};
	});

builder.Services.AddAuthorization();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();

	using var scope = app.Services.CreateScope();
	var db = scope.ServiceProvider.GetRequiredService<ClinicDbContext>();
	db.Database.Migrate();
}

app.UseHttpsRedirection();
app.UseCors("AllowVite");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
