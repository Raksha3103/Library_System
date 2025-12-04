namespace Library_Management_System.Models
{
    public class UserCreateDTO
    {
        public int? UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string? Password { get; set; } 
        public string PhoneNumber { get; set; }
        public string Role { get; set; }
    }
}
