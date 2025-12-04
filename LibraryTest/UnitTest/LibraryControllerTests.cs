using Library_Management_System.Controllers;
using Library_Management_System.Models;
using Library_Management_System.Services;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace Library_Management_System.Tests.UnitTest
{
    public class LibraryControllerTests
    {
        private readonly Mock<ILibraryService> _mockService;
        private readonly LibraryController _controller;

        public LibraryControllerTests()
        {
            _mockService = new Mock<ILibraryService>();
            _controller = new LibraryController(_mockService.Object);
        }

        [Fact]
        public async Task GetAllBooks_ReturnsOkResult_WithListOfBooks()
        {
            // Arrange
            var books = new List<BookDTO>
            {
                new BookDTO { BookId = 1, Title = "Book1" },
                new BookDTO { BookId = 2, Title = "Book2" }
            };
            _mockService.Setup(s => s.GetAllBooksAsync()).ReturnsAsync(books);

            // Act
            var result = await _controller.GetAllBooks();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedBooks = Assert.IsType<List<BookDTO>>(okResult.Value);
            Assert.Equal(2, returnedBooks.Count);
        }

        [Fact]
        public async Task GetBookById_ReturnsNotFound_WhenBookDoesNotExist()
        {
            // Arrange
            _mockService.Setup(s => s.GetBookByIdAsync(1)).ReturnsAsync((BookDTO)null);

            // Act
            var result = await _controller.GetBookById(1);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task GetBookById_ReturnsOk_WhenBookExists()
        {
            // Arrange
            var book = new BookDTO { BookId = 1, Title = "Book1" };
            _mockService.Setup(s => s.GetBookByIdAsync(1)).ReturnsAsync(book);

            // Act
            var result = await _controller.GetBookById(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(book, okResult.Value);
        }

        [Fact]
        public async Task AddBook_ReturnsBadRequest_WhenBookIsInvalid()
        {
            // Arrange
            _mockService.Setup(s => s.AddBookAsync(It.IsAny<BookDTO>())).ReturnsAsync((BookDTO)null);

            // Act
            var result = await _controller.AddBook(new BookDTO());

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid book data or author not found", badRequest.Value);
        }

        [Fact]
        public async Task AddBook_ReturnsOk_WhenBookIsAdded()
        {
            // Arrange
            var book = new BookDTO { BookId = 1, Title = "Book1" };
            _mockService.Setup(s => s.AddBookAsync(It.IsAny<BookDTO>())).ReturnsAsync(book);

            // Act
            var result = await _controller.AddBook(new BookDTO());

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(book, okResult.Value);
        }

        [Fact]
        public async Task DeleteBook_ReturnsNoContent_WhenDeleted()
        {
            // Arrange
            _mockService.Setup(s => s.DeleteBookAsync(1)).ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteBook(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteBook_ReturnsNotFound_WhenBookDoesNotExist()
        {
            // Arrange
            _mockService.Setup(s => s.DeleteBookAsync(1)).ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteBook(1);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task UpdateBookPartial_ReturnsNoContent_WhenUpdated()
        {
            // Arrange
            _mockService.Setup(s => s.UpdateBookPartialAsync(1, It.IsAny<JsonPatchDocument<BookDTO>>()))
                        .ReturnsAsync(true);

            // Act
            var result = await _controller.UpdateBookPartial(1, new JsonPatchDocument<BookDTO>());

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task UpdateBookPartial_ReturnsNotFound_WhenBookDoesNotExist()
        {
            // Arrange
            _mockService.Setup(s => s.UpdateBookPartialAsync(1, It.IsAny<JsonPatchDocument<BookDTO>>()))
                        .ReturnsAsync(false);

            // Act
            var result = await _controller.UpdateBookPartial(1, new JsonPatchDocument<BookDTO>());

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task GetAllBooks_ReturnsOk_WithEmptyList()
        {
            // Arrange
            _mockService.Setup(s => s.GetAllBooksAsync()).ReturnsAsync(new List<BookDTO>());

            // Act
            var result = await _controller.GetAllBooks();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedBooks = Assert.IsType<List<BookDTO>>(okResult.Value);
            Assert.Empty(returnedBooks);
        }

        [Fact]
        public async Task GetBookByName_ReturnsOk_WhenBookExists()
        {
            var book = new BookDTO { BookId = 5, Title = "Harry Potter" };
            _mockService.Setup(s => s.GetBookByNameAsync("Harry Potter")).ReturnsAsync(book);

            var result = await _controller.GetBookByName("Harry Potter");

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(book, okResult.Value);
        }
        [Fact]
        public async Task GetBookByName_ReturnsNotFound_WhenBookDoesNotExist()
        {
            _mockService.Setup(s => s.GetBookByNameAsync("Unknown")).ReturnsAsync((BookDTO)null);

            var result = await _controller.GetBookByName("Unknown");

            Assert.IsType<NotFoundResult>(result);
        }
        [Fact]
        public async Task AddBook_ReturnsBadRequest_WhenDtoIsNull()
        {
            var result = await _controller.AddBook(null);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid book data or author not found", badRequest.Value);
        }
        [Fact]
        public async Task UpdateBook_ReturnsOk_WhenUpdated()
        {
            var updated = new BookDTO { BookId = 1, Title = "Updated" };
            _mockService.Setup(s => s.UpdateBookAsync(1, It.IsAny<BookDTO>())).ReturnsAsync(updated);

            var result = await _controller.UpdateBook(1, new BookDTO());

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(updated, okResult.Value);
        }
        [Fact]
        public async Task UpdateBook_ReturnsNotFound_WhenBookDoesNotExist()
        {
            _mockService.Setup(s => s.UpdateBookAsync(1, It.IsAny<BookDTO>())).ReturnsAsync((BookDTO)null);

            var result = await _controller.UpdateBook(1, new BookDTO());

            Assert.IsType<NotFoundResult>(result);
        }
        [Fact]
        public async Task GetBooksByAuthorName_ReturnsOk_WithBooks()
        {
            var books = new List<BookDTO> { new BookDTO { BookId = 1, Title = "BookA" } };
            _mockService.Setup(s => s.GetBooksByAuthorNameAsync("John")).ReturnsAsync(books);

            var result = await _controller.GetBooksByAuthorName("John");

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedBooks = Assert.IsType<List<BookDTO>>(okResult.Value);
            Assert.Single(returnedBooks);
        }
        [Fact]
        public async Task GetBooksByAuthorName_ReturnsOk_WithEmptyList()
        {
            _mockService.Setup(s => s.GetBooksByAuthorNameAsync("Unknown")).ReturnsAsync(new List<BookDTO>());

            var result = await _controller.GetBooksByAuthorName("Unknown");

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedBooks = Assert.IsType<List<BookDTO>>(okResult.Value);
            Assert.Empty(returnedBooks);
        }


    }
}
