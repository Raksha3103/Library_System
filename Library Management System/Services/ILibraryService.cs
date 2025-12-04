using Library_Management_System.Models;
using Microsoft.AspNetCore.JsonPatch;

namespace Library_Management_System.Services
{
    public interface ILibraryService
    {
        Task<IEnumerable<BookDTO>> GetAllBooksAsync();
        Task<BookDTO?> GetBookByIdAsync(int id);
        Task<BookDTO?> GetBookByNameAsync(string name);
        Task<BookDTO?> AddBookAsync(BookDTO bookDTO);
        Task<BookDTO?> UpdateBookAsync(int id, BookDTO bookDTO);
        Task<bool> DeleteBookAsync(int id);
        Task<IEnumerable<BookDTO>> GetBooksByAuthorNameAsync(string name);
        Task<bool> UpdateBookPartialAsync(int id, JsonPatchDocument<BookDTO> patchDocument);
    }
}
