using Library_Management_System.Models;
using Library_Management_System.Services;
using Microsoft.AspNetCore.Mvc;

namespace Library_Management_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ILoginService _loginService;

        public LoginController(ILoginService loginService)
        {
            _loginService = loginService;
        }

        [HttpPost]
        public async Task<IActionResult> AdminLogin([FromBody] LoginCreateDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid login data.");

            try
            {
                var result = await _loginService.LoginAsync(model);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpPut("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] LoginCreateDTO model)
        {
            try
            {
                var result = await _loginService.ForgotPasswordAsync(model);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }
    }
}
