using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Library_Management_System.Models;
using Library_Management_System.Repository;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Library_Management_System.Services
{
    public class LoginService : ILoginService
    {
        private readonly ILibraryRepository<User> _userRepo;
        private readonly IConfiguration _configuration;

        public LoginService(IConfiguration configuration, ILibraryRepository<User> userRepo)
        {
            _configuration = configuration;
            _userRepo = userRepo;
        }

        public async Task<object> LoginAsync(LoginCreateDTO model)
        {
            var user = await _userRepo.GetByIdAsync(u => u.email == model.email);
            if (user == null)
                throw new UnauthorizedAccessException("Invalid email or password.");

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(model.Password, user.passwordHash);
            if (!isPasswordValid)
                throw new UnauthorizedAccessException("Invalid email or password.");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration.GetValue<string>("JWTSecret"));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.name),
                    new Claim(ClaimTypes.Role, user.role)
                }),
                Expires = DateTime.Now.AddHours(4),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha512Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = tokenHandler.WriteToken(token);

            return new
            {
                message = "Login successful",
                token = jwtToken,
                user = new
                {
                    user.userId,
                    user.name,
                    user.email,
                    user.role
                }
            };
        }

        public async Task<string> ForgotPasswordAsync(LoginCreateDTO model)
        {
            var user = await _userRepo.GetByIdAsync(u => u.email == model.email);
            if (user == null)
                throw new UnauthorizedAccessException("Invalid email or password.");

            user.passwordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);
            await _userRepo.UpdateAsync(user);

            return "The password is updated successfully";
        }
    }
}
