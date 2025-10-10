using Microsoft.AspNetCore.Mvc;
using Backend.Repositories;
using Backend.Models;

namespace Backend.Controllers
{
    /// <summary>
    /// Simple controller for seeding the database with sample data
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly ISpecializationRepository _specializationRepo;
        private readonly IDoctorRepository _doctorRepo;
        private readonly IDoctorScheduleRepository _scheduleRepo;
        private readonly ILogger<SeedController> _logger;

        public SeedController(
            ISpecializationRepository specializationRepo,
            IDoctorRepository doctorRepo,
            IDoctorScheduleRepository scheduleRepo,
            ILogger<SeedController> logger)
        {
            _specializationRepo = specializationRepo;
            _doctorRepo = doctorRepo;
            _scheduleRepo = scheduleRepo;
            _logger = logger;
        }

        /// <summary>
        /// Seeds the database with sample data
        /// </summary>
        [HttpPost("all")]
        public async Task<IActionResult> SeedAllData()
        {
            try
            {
                _logger.LogInformation("Starting database seeding...");

                // 1. Seed Specializations
                var specializationCount = await SeedSpecializationsInternal();
                
                // 2. Seed Doctors
                var doctorCount = await SeedDoctorsInternal();
                
                // 3. Seed Schedules
                var scheduleCount = await SeedSchedulesInternal();

                _logger.LogInformation("Database seeding completed successfully");

                return Ok(new
                {
                    success = true,
                    message = "Database seeded successfully",
                    data = new
                    {
                        specializations = specializationCount,
                        doctors = doctorCount,
                        schedules = scheduleCount
                    },
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while seeding database");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error occurred while seeding database",
                    error = ex.Message
                });
            }
        }

        private async Task<int> SeedSpecializationsInternal()
        {
            var specializations = new[]
            {
                new Specialization { Name = "Cardiology", Description = "Heart and cardiovascular system", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Specialization { Name = "Dermatology", Description = "Skin, hair, and nail conditions", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Specialization { Name = "Neurology", Description = "Nervous system disorders", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Specialization { Name = "Orthopedics", Description = "Bone, joint, and muscle conditions", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Specialization { Name = "Pediatrics", Description = "Medical care for children", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Specialization { Name = "Psychiatry", Description = "Mental health and behavioral disorders", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Specialization { Name = "General Medicine", Description = "General medical care and consultation", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Specialization { Name = "Gynecology", Description = "Women's reproductive health", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Specialization { Name = "Ophthalmology", Description = "Eye and vision care", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Specialization { Name = "ENT", Description = "Ear, nose, and throat conditions", IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            };

            foreach (var spec in specializations)
            {
                await _specializationRepo.CreateAsync(spec);
            }

            return specializations.Length;
        }

        private async Task<int> SeedDoctorsInternal()
        {
            var doctors = new[]
            {
                new Doctor
                {
                    FullName = "Dr. Lakshan Pathirana",
                    SpecializationId = 1,
                    ContactNumber = "+94771234567",
                    Email = "lakshan.pathirana@medisync.lk",
                    Qualifications = "MBBS, MD (Cardiology), FRCP",
                    ExperienceYears = 15,
                    Details = "Senior Consultant Cardiologist with expertise in interventional cardiology",
                    HospitalName = "National Hospital of Sri Lanka",
                    Address = "Colombo 10",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Doctor
                {
                    FullName = "Dr. Nadeesha Perera",
                    SpecializationId = 2,
                    ContactNumber = "+94772345678",
                    Email = "nadeesha.perera@medisync.lk",
                    Qualifications = "MBBS, MD (Dermatology), MRCP",
                    ExperienceYears = 12,
                    Details = "Consultant Dermatologist specializing in cosmetic and medical dermatology",
                    HospitalName = "Asiri Medical Hospital",
                    Address = "Colombo 05",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Doctor
                {
                    FullName = "Dr. Chamika Lakshan",
                    SpecializationId = 3,
                    ContactNumber = "+94773456789",
                    Email = "chamika.lakshan@medisync.lk",
                    Qualifications = "MBBS, MD (Neurology), FRCP",
                    ExperienceYears = 18,
                    Details = "Senior Neurologist with expertise in stroke management and epilepsy",
                    HospitalName = "Lanka Hospital",
                    Address = "Colombo 06",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Doctor
                {
                    FullName = "Dr. Priya Fernando",
                    SpecializationId = 4,
                    ContactNumber = "+94774567890",
                    Email = "priya.fernando@medisync.lk",
                    Qualifications = "MBBS, MS (Orthopedics), FRCS",
                    ExperienceYears = 20,
                    Details = "Orthopedic Surgeon specializing in joint replacement and sports medicine",
                    HospitalName = "Nawaloka Hospital",
                    Address = "Colombo 02",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Doctor
                {
                    FullName = "Dr. Saman Silva",
                    SpecializationId = 5,
                    ContactNumber = "+94775678901",
                    Email = "saman.silva@medisync.lk",
                    Qualifications = "MBBS, MD (Pediatrics), MRCPCH",
                    ExperienceYears = 14,
                    Details = "Consultant Pediatrician with expertise in neonatal care",
                    HospitalName = "Lady Ridgeway Hospital",
                    Address = "Colombo 08",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Doctor
                {
                    FullName = "Dr. Anushka Rajapaksha",
                    SpecializationId = 7,
                    ContactNumber = "+94776789012",
                    Email = "anushka.rajapaksha@medisync.lk",
                    Qualifications = "MBBS, MD (Internal Medicine), MRCP",
                    ExperienceYears = 10,
                    Details = "General Physician with focus on preventive medicine",
                    HospitalName = "Durdans Hospital",
                    Address = "Colombo 03",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            foreach (var doctor in doctors)
            {
                await _doctorRepo.CreateAsync(doctor);
            }

            return doctors.Length;
        }

        private async Task<int> SeedSchedulesInternal()
        {
            var scheduleCount = 0;
            
            // Create schedules for the next 14 days for each doctor (1-6)
            for (int doctorId = 1; doctorId <= 6; doctorId++)
            {
                for (int day = 0; day < 14; day++)
                {
                    var scheduleDate = DateTime.Today.AddDays(day);
                    
                    // Skip Sundays
                    if (scheduleDate.DayOfWeek == DayOfWeek.Sunday) continue;

                    // Morning session (9 AM - 12 PM)
                    var morningSchedule = new DoctorSchedule
                    {
                        DoctorId = doctorId,
                        ScheduleDate = scheduleDate,
                        StartTime = new TimeSpan(9, 0, 0),
                        EndTime = new TimeSpan(12, 0, 0),
                        SlotDurationMinutes = 30,
                        MaxPatientsPerSlot = 1,
                        TotalSlots = 6, // 3 hours / 30 minutes = 6 slots
                        BookedSlots = 0,
                        IsActive = true,
                        Notes = "Morning consultation session",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    await _scheduleRepo.CreateAsync(morningSchedule);
                    scheduleCount++;

                    // Afternoon session (2 PM - 5 PM) - only on weekdays
                    if (scheduleDate.DayOfWeek != DayOfWeek.Saturday)
                    {
                        var afternoonSchedule = new DoctorSchedule
                        {
                            DoctorId = doctorId,
                            ScheduleDate = scheduleDate,
                            StartTime = new TimeSpan(14, 0, 0),
                            EndTime = new TimeSpan(17, 0, 0),
                            SlotDurationMinutes = 30,
                            MaxPatientsPerSlot = 1,
                            TotalSlots = 6, // 3 hours / 30 minutes = 6 slots
                            BookedSlots = 0,
                            IsActive = true,
                            Notes = "Afternoon consultation session",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        };

                        await _scheduleRepo.CreateAsync(afternoonSchedule);
                        scheduleCount++;
                    }
                }
            }

            return scheduleCount;
        }

        /// <summary>
        /// Check database status
        /// </summary>
        [HttpGet("status")]
        public async Task<IActionResult> GetDatabaseStatus()
        {
            try
            {
                var specializations = await _specializationRepo.GetAllAsync();
                var doctors = await _doctorRepo.GetAllAsync();
                var schedules = await _scheduleRepo.GetAllAsync();

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        specializations = specializations.Count(),
                        doctors = doctors.Count(),
                        schedules = schedules.Count()
                    },
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking database status");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error checking database status",
                    error = ex.Message
                });
            }
        }
    }
}
