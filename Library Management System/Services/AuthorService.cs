using AutoMapper;
using Library_Management_System.Data;
using Library_Management_System.Models;
using Library_Management_System.Repository;
using Library_Management_System.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Library_Management_System.Services
{
    public class AuthorService : IAuthorService
    {
        private readonly ILibraryRepository<Author> _authorRepo;
        private readonly BookDbContext _dbContext;
        private readonly IMapper _mapper;

        public AuthorService(
            ILibraryRepository<Author> authorRepo,
            BookDbContext dbContext,
            IMapper mapper)
        {
            _authorRepo = authorRepo;
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<IEnumerable<AuthorDTO>> GetAllAuthors()
        {
            var authors = await _authorRepo.GetAllAsync();
            return _mapper.Map<IEnumerable<AuthorDTO>>(authors);
        }

        public async Task<AuthorDTO?> GetAuthorById(int id)
        {
            var author = await _authorRepo.GetByIdAsync(a => a.AuthorId == id);
            if (author == null)
                return null;

            return _mapper.Map<AuthorDTO>(author);
        }

        public async Task<AuthorDTO> AddAuthor(AuthorDTO authorDTO)
        {
            var existing = await _authorRepo.GetByIdAsync(a => a.FullName == authorDTO.FullName);
            if (existing != null)
                throw new Exception($"Author '{authorDTO.FullName}' already exists.");

            var newAuthor = _mapper.Map<Author>(authorDTO);
            await _authorRepo.AddAsync(newAuthor);

            return _mapper.Map<AuthorDTO>(newAuthor);
        }

        public async Task<AuthorDTO?> UpdateAuthor(int id, AuthorDTO authorDTO)
        {
            var author = await _authorRepo.GetByIdAsync(a => a.AuthorId == id);
            if (author == null)
                return null;

            author.FullName = authorDTO.FullName ?? author.FullName;
            author.Country = authorDTO.Country ?? author.Country;
            author.Biography = authorDTO.Biography ?? author.Biography;

            await _authorRepo.UpdateAsync(author);
            return _mapper.Map<AuthorDTO>(author);
        }

        public async Task<bool> DeleteAuthor(int id)
        {
            var author = await _authorRepo.GetByIdAsync(a => a.AuthorId == id, false, a => a.Books);
            if (author == null)
                return false;

            foreach (var book in author.Books)
                await _dbContext.Entry(book).Collection(b => b.BorrowRecords).LoadAsync();

            if (author.Books.Any(book => book.BorrowRecords.Any()))
                throw new Exception("Cannot delete author. Some books have borrow history.");

            if (author.Books.Any())
                throw new Exception("Cannot delete author while they have books. Delete the books first.");

            await _authorRepo.DeleteAsync(author);
            return true;
        }
    }
}
