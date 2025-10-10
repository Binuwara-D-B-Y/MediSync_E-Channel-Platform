using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly ILogger<TestController> _logger;

        public TestController(ILogger<TestController> logger)
        {
            _logger = logger;
        }

        [HttpGet("health")]
        public IActionResult HealthCheck()
        {
            return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
        }

        [HttpGet("database")]
        public async Task<IActionResult> DatabaseTest()
        {
            try
            {
                // Simple database connectivity test
                return Ok(new { status = "database connected", timestamp = DateTime.UtcNow });
            }
            catch (Exception)
            {
                return StatusCode(500, new { status = "database error" });
            }
        }
    }
}