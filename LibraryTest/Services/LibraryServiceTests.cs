using AutoMapper;
using FluentAssertions;
using Library_Management_System.Models;
using Library_Management_System.Repository;
using Library_Management_System.Services;
using Microsoft.AspNetCore.JsonPatch;
using Moq;
using System.Linq.Expressions;
using Xunit;

namespace Library_Management_System.Tests.Services
{
    public class LibraryServiceTests
    {
        private readonly Mock<ILibraryRepository<Books>> _bookRepoMock;
        private readonly Mock<ILibraryRepository<Author>> _authorRepoMock;
        private readonly Mock<ILibraryRepository<BorrowRecords>> _borrowRepoMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly LibraryService _service;

        public LibraryServiceTests()
        {
            _bookRepoMock = new Mock<ILibraryRepository<Books>>();
            _authorRepoMock = new Mock<ILibraryRepository<Author>>();
            _borrowRepoMock = new Mock<ILibraryRepository<BorrowRecords>>();
            _mapperMock = new Mock<IMapper>();

            _service = new LibraryService(
                _bookRepoMock.Object,
                _authorRepoMock.Object,
                _borrowRepoMock.Object,
                _mapperMock.Object
            );
        }

        [Fact]
        public async Task GetAllBooks_ShouldReturnMappedBooks()
        {
            var bookList = new List<Books> { new Books { BookId = 1, AuthorId = 10 } };
            var author = new Author { AuthorId = 10, FullName = "Author A" };
            var mappedList = new List<BookDTO> { new BookDTO { BookId = 1 } };

            _bookRepoMock.Setup(r => r.GetAllAsync())
                         .ReturnsAsync(bookList);

            _authorRepoMock.Setup(r => r.GetByIdAsync(
                It.IsAny<Expression<Func<Author, bool>>>(),
                It.IsAny<bool>(),
                It.IsAny<Expression<Func<Author, object>>[]>()))
                .ReturnsAsync(author);

            _mapperMock.Setup(m => m.Map<List<BookDTO>>(bookList))
                       .Returns(mappedList);

            var result = await _service.GetAllBooksAsync();

            result.Should().HaveCount(1);
        }

       
        [Fact]
        public async Task GetBookById_ShouldReturnBook_WhenExists()
        {
            var book = new Books { BookId = 1 };
            var dto = new BookDTO { BookId = 1 };

            _bookRepoMock.Setup(r => r.GetByIdAsync(
                It.IsAny<Expression<Func<Books, bool>>>(),
                It.IsAny<bool>(),
                It.IsAny<Expression<Func<Books, object>>[]>()))
                .ReturnsAsync(book);

            _mapperMock.Setup(m => m.Map<BookDTO>(book)).Returns(dto);

            var result = await _service.GetBookByIdAsync(1);

            result.Should().NotBeNull();
            result!.BookId.Should().Be(1);
        }

        [Fact]
        public async Task GetBookById_ShouldReturnNull_WhenNotExists()
        {
            _bookRepoMock.Setup(r => r.GetByIdAsync(
               It.IsAny<Expression<Func<Books, bool>>>(),
               It.IsAny<bool>(),
               It.IsAny<Expression<Func<Books, object>>[]>()))
               .ReturnsAsync((Books?)null);

            var result = await _service.GetBookByIdAsync(1);

            result.Should().BeNull();
        }

     
        [Fact]
        public async Task AddBook_ShouldReturnDTO_WhenSuccessful()
        {
            var dto = new BookDTO { Title = "Test", AuthorId = 10, TotalCopies = 5 };
            var author = new Author { AuthorId = 10 };
            var createdBook = new Books { BookId = 1 };
            var expectedDto = new BookDTO { BookId = 1 };

            _bookRepoMock.Setup(r => r.GetByIdAsync(
                It.IsAny<Expression<Func<Books, bool>>>(),
                It.IsAny<bool>(),
                It.IsAny<Expression<Func<Books, object>>[]>()))
                .ReturnsAsync((Books?)null);

            _authorRepoMock.Setup(r => r.GetByIdAsync(
                It.IsAny<Expression<Func<Author, bool>>>(),
                It.IsAny<bool>(),
                It.IsAny<Expression<Func<Author, object>>[]>()))
                .ReturnsAsync(author);

            _mapperMock.Setup(m => m.Map<Books>(dto)).Returns(createdBook);
            _mapperMock.Setup(m => m.Map<BookDTO>(createdBook)).Returns(expectedDto);

            var result = await _service.AddBookAsync(dto);

            result.Should().NotBeNull();
            result!.BookId.Should().Be(1);
        }

        [Fact]
        public async Task AddBook_ShouldReturnNull_WhenDuplicateTitle()
        {
            var dto = new BookDTO { Title = "Duplicate" };

            _bookRepoMock.Setup(r => r.GetByIdAsync(
                It.IsAny<Expression<Func<Books, bool>>>(),
                It.IsAny<bool>(),
                It.IsAny<Expression<Func<Books, object>>[]>()))
                .ReturnsAsync(new Books());

            var result = await _service.AddBookAsync(dto);

            result.Should().BeNull();
        }

        [Fact]
        public async Task AddBook_ShouldReturnNull_WhenAuthorNotFound()
        {
            var dto = new BookDTO { Title = "Test", AuthorId = 20 };

            _bookRepoMock.Setup(r => r.GetByIdAsync(
                It.IsAny<Expression<Func<Books, bool>>>(),
                It.IsAny<bool>(),
                It.IsAny<Expression<Func<Books, object>>[]>()))
                .ReturnsAsync((Books?)null);

            _authorRepoMock.Setup(r => r.GetByIdAsync(
                It.IsAny<Expression<Func<Author, bool>>>(),
                It.IsAny<bool>(),
                It.IsAny<Expression<Func<Author, object>>[]>()))
                .ReturnsAsync((Author?)null);

            var result = await _service.AddBookAsync(dto);

            result.Should().BeNull();
        }

        [Fact]
        public async Task DeleteBook_ShouldReturnTrue_WhenExists()
        {
            _bookRepoMock.Setup(r => r.GetByIdAsync(
                It.IsAny<Expression<Func<Books, bool>>>(),
                It.IsAny<bool>(),
                It.IsAny<Expression<Func<Books, object>>[]>()))
                .ReturnsAsync(new Books());

            _borrowRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<BorrowRecords>());

            var result = await _service.DeleteBookAsync(1);

            result.Should().BeTrue();
        }

        [Fact]
        public async Task DeleteBook_ShouldReturnFalse_WhenNotFound()
        {
            _bookRepoMock.Setup(r => r.GetByIdAsync(
                It.IsAny<Expression<Func<Books, bool>>>(),
                It.IsAny<bool>(),
                It.IsAny<Expression<Func<Books, object>>[]>()))
                .ReturnsAsync((Books?)null);

            var result = await _service.DeleteBookAsync(999);

            result.Should().BeFalse();
        }

        [Fact]
        public async Task UpdateBookPartial_ShouldApplyPatch_WhenFound()
        {
            var book = new Books { BookId = 1 };
            var dto = new BookDTO { BookId = 1 };
            var patch = new JsonPatchDocument<BookDTO>();

            _bookRepoMock.Setup(r => r.GetByIdAsync(
                It.IsAny<Expression<Func<Books, bool>>>(),
                It.IsAny<bool>(),
                It.IsAny<Expression<Func<Books, object>>[]>()))
                .ReturnsAsync(book);

            _mapperMock.Setup(m => m.Map<BookDTO>(book)).Returns(dto);
            _mapperMock.Setup(m => m.Map<Books>(dto)).Returns(book);

            var result = await _service.UpdateBookPartialAsync(1, patch);

            result.Should().BeTrue();
        }

        [Fact]
        public async Task UpdateBookPartial_ShouldReturnFalse_WhenNotFound()
        {
            _bookRepoMock.Setup(r => r.GetByIdAsync(
                It.IsAny<Expression<Func<Books, bool>>>(),
                It.IsAny<bool>(),
                It.IsAny<Expression<Func<Books, object>>[]>()))
                .ReturnsAsync((Books?)null);

            var result = await _service.UpdateBookPartialAsync(999, new JsonPatchDocument<BookDTO>());

            result.Should().BeFalse();
        }
    }
}
