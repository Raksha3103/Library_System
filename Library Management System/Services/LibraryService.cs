using AutoMapper;
using Library_Management_System.Models;
using Library_Management_System.Repository;
using Microsoft.AspNetCore.JsonPatch;

namespace Library_Management_System.Services
{
    public class LibraryService : ILibraryService
    {
        private readonly ILibraryRepository<BorrowRecords> _borrowRepo;
        private readonly ILibraryRepository<Books> _libraryRepo;
        private readonly ILibraryRepository<Author> _authorRepo;
        private readonly IMapper _mapper;

        public LibraryService(
            ILibraryRepository<Books> libraryRepo,
            ILibraryRepository<Author> authorRepo,
            ILibraryRepository<BorrowRecords> borrowRepo,
            IMapper mapper)
        {
            _libraryRepo = libraryRepo;
            _authorRepo = authorRepo;
            _borrowRepo = borrowRepo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<BookDTO>> GetAllBooksAsync()
        {
            var books = await _libraryRepo.GetAllAsync();
            foreach (var b in books)
                b.Author = await _authorRepo.GetByIdAsync(a => a.AuthorId == b.AuthorId);

            return _mapper.Map<List<BookDTO>>(books);
        }

        public async Task<BookDTO?> GetBookByIdAsync(int id)
        {
            var book = await _libraryRepo.GetByIdAsync(b => b.BookId == id, false, b => b.Author);
            return book == null ? null : _mapper.Map<BookDTO>(book);
        }

        public async Task<BookDTO?> GetBookByNameAsync(string name)
        {
            var book = await _libraryRepo.GetByIdAsync(b => b.Title.Contains(name), false, b => b.Author);
            return book == null ? null : _mapper.Map<BookDTO>(book);
        }

        public async Task<BookDTO?> AddBookAsync(BookDTO bookDTO)
        {
            var existing = await _libraryRepo.GetByIdAsync(b => b.Title.ToLower() == bookDTO.Title.ToLower());
            if (existing != null) return null;

            Author? author = null;
            if (bookDTO.AuthorId > 0)
                author = await _authorRepo.GetByIdAsync(a => a.AuthorId == bookDTO.AuthorId);
            else if (!string.IsNullOrWhiteSpace(bookDTO.AuthorName))
                author = await _authorRepo.GetByIdAsync(a => a.FullName.Contains(bookDTO.AuthorName));

            if (author == null) return null;

            var newBook = _mapper.Map<Books>(bookDTO);
            newBook.AuthorId = author.AuthorId;
            newBook.Author = author;
            newBook.AvailableCopies = bookDTO.TotalCopies;

            await _libraryRepo.AddAsync(newBook);
            return _mapper.Map<BookDTO>(newBook);
        }

        public async Task<BookDTO?> UpdateBookAsync(int id, BookDTO bookDTO)
        {
            var existingBook = await _libraryRepo.GetByIdAsync(b => b.BookId == id, false, b => b.Author);
            if (existingBook == null) return null;

            existingBook.Title = bookDTO.Title;
            existingBook.Genre = bookDTO.Genre;
            existingBook.TotalCopies = bookDTO.TotalCopies;
            existingBook.AvailableCopies = Math.Min(bookDTO.AvailableCopies, bookDTO.TotalCopies);
            existingBook.PublishedDate = bookDTO.PublishedDate;

            Author? author = null;
            if (bookDTO.AuthorId > 0)
                author = await _authorRepo.GetByIdAsync(a => a.AuthorId == bookDTO.AuthorId);
            else if (!string.IsNullOrWhiteSpace(bookDTO.AuthorName))
                author = await _authorRepo.GetByIdAsync(a => a.FullName.Contains(bookDTO.AuthorName));

            if (author != null)
            {
                existingBook.AuthorId = author.AuthorId;
                existingBook.Author = author;
            }

            await _libraryRepo.UpdateAsync(existingBook);
            return _mapper.Map<BookDTO>(existingBook);
        }

        public async Task<bool> DeleteBookAsync(int id)
        {
            var book = await _libraryRepo.GetByIdAsync(b => b.BookId == id);
            if (book == null) return false;

            var records = await _borrowRepo.GetAllAsync();
            foreach (var rec in records.Where(r => r.BookId == id))
                await _borrowRepo.DeleteAsync(rec);

            await _libraryRepo.DeleteAsync(book);
            return true;
        }

        public async Task<IEnumerable<BookDTO>> GetBooksByAuthorNameAsync(string name)
        {
            var author = await _authorRepo.GetByIdAsync(a => a.FullName.Contains(name), false, a => a.Books);
            if (author == null) return Enumerable.Empty<BookDTO>();

            foreach (var b in author.Books)
                b.Author = author;

            return author.Books.Select(b => new BookDTO
            {
                BookId = b.BookId,
                Title = b.Title,
                Genre = b.Genre,
                AvailableCopies = b.AvailableCopies,
                AuthorName = author.FullName
            }).ToList();
        }

        public async Task<bool> UpdateBookPartialAsync(int id, JsonPatchDocument<BookDTO> patchDocument)
        {
            var existing = await _libraryRepo.GetByIdAsync(b => b.BookId == id, true);
            if (existing == null) return false;

            var dto = _mapper.Map<BookDTO>(existing);
            patchDocument.ApplyTo(dto);

            existing = _mapper.Map<Books>(dto);
            await _libraryRepo.UpdateAsync(existing);
            return true;
        }
    }
}
