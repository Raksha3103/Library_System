using Library_Management_System.Models;
using Library_Management_System.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Library_Management_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorController : ControllerBase
    {
        private readonly IAuthorService _authorService;

        public AuthorController(IAuthorService authorService)
        {
            _authorService = authorService;
        }

        [HttpGet("All")]
        public async Task<IActionResult> GetAllAuthors()
        {
            return Ok(await _authorService.GetAllAuthors());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAuthorById(int id)
        {
            var author = await _authorService.GetAuthorById(id);
            if (author == null)
                return NotFound($"Author with ID {id} not found.");

            return Ok(author);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> AddAuthor([FromBody] AuthorDTO authorDTO)
        {
            try
            {
                var author = await _authorService.AddAuthor(authorDTO);
                return CreatedAtAction(nameof(GetAuthorById), new { id = author.AuthorId }, author);
            }
            catch (Exception ex)
            {
                return Conflict(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAuthor(int id, [FromBody] AuthorDTO authorDTO)
        {
            var updated = await _authorService.UpdateAuthor(id, authorDTO);
            if (updated == null)
                return NotFound($"Author with ID {id} not found.");

            return Ok(updated);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuthor(int id)
        {
            try
            {
                bool deleted = await _authorService.DeleteAuthor(id);
                if (!deleted)
                    return NotFound($"Author with ID {id} not found.");

                return NoContent();
            }
            catch (Exception ex)
            {
                return Conflict(ex.Message);
            }
        }
    }
}
