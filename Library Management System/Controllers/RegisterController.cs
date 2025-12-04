using Library_Management_System.Models;
using Microsoft.AspNetCore.Mvc;

namespace Library_Management_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly IRegisterService _registerService;
        private readonly ILogger<RegisterController> _logger;

        public RegisterController(IRegisterService registerService, ILogger<RegisterController> logger)
        {
            _registerService = registerService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<UserDTO>> RegisterUser([FromBody] UserCreateDTO userDto)
        {
            try
            {
                var result = await _registerService.RegisterUserAsync(userDto);
                return CreatedAtAction(nameof(RegisterUser), new { email = result.Email }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Registration failed");
                return BadRequest(ex.Message);
            }
        }
    }
}
