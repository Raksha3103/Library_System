using Library_Management_System.Models;

namespace Library_Management_System.Services.Interfaces
{
    public interface IAuthorService
    {
        Task<IEnumerable<AuthorDTO>> GetAllAuthors();
        Task<AuthorDTO?> GetAuthorById(int id);
        Task<AuthorDTO> AddAuthor(AuthorDTO authorDTO);
        Task<AuthorDTO?> UpdateAuthor(int id, AuthorDTO authorDTO);
        Task<bool> DeleteAuthor(int id);
    }
}
