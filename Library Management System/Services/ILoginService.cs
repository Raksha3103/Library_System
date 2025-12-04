using System.Threading.Tasks;
using Library_Management_System.Models;

namespace Library_Management_System.Services
{
    public interface ILoginService
    {
        Task<object> LoginAsync(LoginCreateDTO model);
        Task<string> ForgotPasswordAsync(LoginCreateDTO model);
    }
}
