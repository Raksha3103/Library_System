using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Library_Management_System.Models;
using Library_Management_System.Repository;
using Library_Management_System.Services;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;

namespace LibraryTest.Services
{
    public class LoginServiceTests
    {
        private readonly Mock<ILibraryRepository<User>> _userRepo;
        private readonly Mock<IConfiguration> _config;
        private readonly LoginService _service;

        public LoginServiceTests()
        {
            _userRepo = new Mock<ILibraryRepository<User>>();

            _config = new Mock<IConfiguration>();
            _config.Setup(c => c["JWTSecret"])
         .Returns("abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#");



            _service = new LoginService(_config.Object, _userRepo.Object);
        }

        // Helper to mock repository return values
        private void SetupUserRepo(User? user)
        {
            _userRepo.Setup(r => r.GetByIdAsync(
                    It.IsAny<Expression<Func<User, bool>>>(),
                    It.IsAny<bool>(),
                    It.IsAny<Expression<Func<User, object>>[]>()))
                .ReturnsAsync(user);
        }

        [Fact]
        public async Task Login_ShouldReturnToken_WhenCredentialsAreValid()
        {
            var dto = new LoginCreateDTO { email = "admin@test.com", Password = "1234" };

            var user = new User
            {
                userId = 1,
                email = "admin@test.com",
                name = "Admin",
                role = "Admin",
                passwordHash = BCrypt.Net.BCrypt.HashPassword("1234")
            };

            SetupUserRepo(user);

            var result = await _service.LoginAsync(dto);

            Assert.NotNull(result);
            Assert.Contains("token", result.ToString());
        }

        [Fact]
        public async Task Login_ShouldThrow_WhenEmailDoesNotExist()
        {
            SetupUserRepo(null);
            var dto = new LoginCreateDTO { email = "ghost@test.com", Password = "abc" };

            var act = async () => await _service.LoginAsync(dto);

            await Assert.ThrowsAsync<UnauthorizedAccessException>(act);
        }

        [Fact]
        public async Task Login_ShouldThrow_WhenPasswordIsInvalid()
        {
            var user = new User
            {
                email = "admin@test.com",
                passwordHash = BCrypt.Net.BCrypt.HashPassword("real")
            };

            SetupUserRepo(user);
            var dto = new LoginCreateDTO { email = "admin@test.com", Password = "wrong" };

            var act = async () => await _service.LoginAsync(dto);

            await Assert.ThrowsAsync<UnauthorizedAccessException>(act);
        }

        [Fact]
        public async Task ForgotPassword_ShouldUpdateHash_WhenUserExists()
        {
            var user = new User
            {
                userId = 1,
                email = "admin@test.com",
                passwordHash = "oldpass"
            };

            SetupUserRepo(user);

            _userRepo.Setup(r => r.UpdateAsync(It.IsAny<User>()))
                     .ReturnsAsync(user);

            var dto = new LoginCreateDTO { email = "admin@test.com", Password = "newpass" };

            var result = await _service.ForgotPasswordAsync(dto);

            Assert.Equal("The password is updated successfully", result);
            Assert.True(BCrypt.Net.BCrypt.Verify("newpass", user.passwordHash));
            _userRepo.Verify(r => r.UpdateAsync(It.IsAny<User>()), Times.Once);
        }

        [Fact]
        public async Task ForgotPassword_ShouldThrow_WhenUserNotFound()
        {
            SetupUserRepo(null);

            var dto = new LoginCreateDTO { email = "unknown@test.com", Password = "pass" };

            var act = async () => await _service.ForgotPasswordAsync(dto);

            await Assert.ThrowsAsync<UnauthorizedAccessException>(act);
        }
    }
}
