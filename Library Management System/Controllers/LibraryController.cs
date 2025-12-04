using Library_Management_System.Models;
using Library_Management_System.Services;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace Library_Management_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LibraryController : ControllerBase
    {
        private readonly ILibraryService _libraryService;

        public LibraryController(ILibraryService libraryService)
        {
            _libraryService = libraryService;
        }

        [HttpGet("All")]
        public async Task<IActionResult> GetAllBooks()
            => Ok(await _libraryService.GetAllBooksAsync());

        [HttpGet("id/{id:int}")]
        public async Task<IActionResult> GetBookById(int id)
        {
            var result = await _libraryService.GetBookByIdAsync(id);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpGet("{name}")]
        public async Task<IActionResult> GetBookByName(string name)
        {
            var result = await _libraryService.GetBookByNameAsync(name);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddBook(BookDTO dto)
        {
            var result = await _libraryService.AddBookAsync(dto);
            return result == null ? BadRequest("Invalid book data or author not found") : Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, BookDTO dto)
        {
            var result = await _libraryService.UpdateBookAsync(id, dto);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var success = await _libraryService.DeleteBookAsync(id);
            return success ? NoContent() : NotFound();
        }

        [HttpGet("AuthorByName")]
        public async Task<IActionResult> GetBooksByAuthorName(string name)
            => Ok(await _libraryService.GetBooksByAuthorNameAsync(name));

        [HttpPatch("{id:int}/UpdatePartial")]
        public async Task<IActionResult> UpdateBookPartial(int id, JsonPatchDocument<BookDTO> patchDocument)
        {
            var success = await _libraryService.UpdateBookPartialAsync(id, patchDocument);
            return success ? NoContent() : NotFound();
        }
    }
}
