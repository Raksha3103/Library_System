using AutoMapper;
using Library_Management_System.Models;
using Library_Management_System.Repository;

public class RegisterService : IRegisterService
{
    private readonly ILibraryRepository<User> _userRepo;
    private readonly IMapper _mapper;

    public RegisterService(ILibraryRepository<User> userRepo, IMapper mapper)
    {
        _userRepo = userRepo;
        _mapper = mapper;
    }

    public async Task<UserDTO> RegisterUserAsync(UserCreateDTO userDto)
    {
        if (userDto == null)
            throw new Exception("User data is required.");

        var existingUser = await _userRepo.GetByIdAsync(u => u.email == userDto.Email);
        if (existingUser != null)
            throw new Exception("A user with this email already exists.");

        var user = _mapper.Map<User>(userDto);
        user.passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password ?? "default123");

        if (string.IsNullOrWhiteSpace(user.role))
            user.role = "User";

        var createdUser = await _userRepo.AddAsync(user);
        return _mapper.Map<UserDTO>(createdUser);
    }
}
