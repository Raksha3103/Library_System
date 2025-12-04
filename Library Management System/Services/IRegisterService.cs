using Library_Management_System.Models;

public interface IRegisterService
{
    Task<UserDTO> RegisterUserAsync(UserCreateDTO userDto);
}
