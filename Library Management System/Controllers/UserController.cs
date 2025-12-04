using AutoMapper;
using Library_Management_System.Models;
using Library_Management_System.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Library_Management_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly ILibraryRepository<User> _userRepo;
        private readonly ILibraryRepository<BorrowRecords> _borrowRepo;
        private readonly IMapper _mapper;
        private readonly ILogger<UsersController> _logger;

        public UsersController(ILibraryRepository<User> userRepo,
                               ILibraryRepository<BorrowRecords> borrowRepo,
                               IMapper mapper,
                               ILogger<UsersController> logger)
        {
            _userRepo = userRepo;
            _borrowRepo = borrowRepo;
            _mapper = mapper;
            _logger = logger;
        }
        [HttpGet("All")]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAllUsers()
        {
            var users = await _userRepo.GetAllAsync();
        var userDTOs = _mapper.Map<List<UserDTO>>(users);

            return Ok(userDTOs);
        }
   //     [HttpGet("{name}")]
   //     public async Task<ActionResult<BookDTO>> GetBookByName(string name)
   //     {
   //         var book = await _libraryRepo.GetByIdAsync(b => b.Title == name, false, b => b.Author);
   //         if (book == null)
   //             return NotFound($"Book with ID {name} not found.");

   //         var bookDTO = _mapper.Map<BookDTO>(book);
   //         return Ok(bookDTO);
   //     }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetUserById(int id)
        {
            var user = await _userRepo.GetByIdAsync(
                u => u.userId == id,
                includes: u => u.BorrowRecords
            );

            if (user == null)
                return NotFound("User not found.");

            var userDto = _mapper.Map<UserDTO>(user);
            return Ok(userDto);
        }

   

        [HttpPost]
        public async Task<ActionResult<UserDTO>> AddOrUpdateUser([FromBody] UserCreateDTO userDto)
        {
            if (userDto == null) return BadRequest("User data is required.");

            User user;

            if (userDto.UserId == null || userDto.UserId == 0)
            {
                
                user = new User
                {
                    name = userDto.Name,
                    email = userDto.Email,
                    phoneNumber = userDto.PhoneNumber,
                    role = userDto.Role,
                    passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password ?? "default123")
                };

                var createdUser = await _userRepo.AddAsync(user);
                var result = _mapper.Map<UserDTO>(createdUser);
                return CreatedAtAction(nameof(GetUserById), new { id = createdUser.userId }, result);
            }
            else
            {
                
                user = await _userRepo.GetByIdAsync(u => u.userId == userDto.UserId);
                if (user == null) return NotFound("User not found.");

                user.name = userDto.Name;
                user.email = userDto.Email;
                user.phoneNumber = userDto.PhoneNumber;
                user.role = userDto.Role;

                if (!string.IsNullOrEmpty(userDto.Password))
                {
                    user.passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
                }

                var updatedUser = await _userRepo.UpdateAsync(user);
                var result = _mapper.Map<UserDTO>(updatedUser);
                return Ok(result);
            }
        }
    }
}
