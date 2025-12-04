using Library_Management_System.Controllers;
using Library_Management_System.Models;
using Library_Management_System.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Library_Management_System.Tests.Controllers
{
    public class BorrowControllerTests
    {
        private readonly BorrowController _controller;
        private readonly Mock<IBorrowService> _mockService;

        public BorrowControllerTests()
        {
            _mockService = new Mock<IBorrowService>();
            _controller = new BorrowController(_mockService.Object);
        }

      
        [Fact]
        public async Task BorrowBook_ReturnsOk_WhenSuccessful()
        {
            var dto = new BorrowCreateDTO { BookId = 1, UserId = 10 };
            var expected = new BorrowRecordsDTO { BookId = 1, UserId = 10 };

            _mockService.Setup(s => s.BorrowBookAsync(dto)).ReturnsAsync(expected);

            var result = await _controller.BorrowBook(dto);

            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(expected, ok.Value);
        }

        [Fact]
        public async Task BorrowBook_ReturnsBadRequest_WhenExceptionThrown()
        {
            var dto = new BorrowCreateDTO { BookId = 1, UserId = 10 };

            _mockService.Setup(s => s.BorrowBookAsync(dto))
                        .ThrowsAsync(new Exception("Book not available."));

            var result = await _controller.BorrowBook(dto);

            var bad = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Book not available.", bad.Value);
        }

      

        [Fact]
        public async Task ReturnBook_ReturnsOk_WhenSuccessful()
        {
            var dto = new BorrowCreateDTO { BookId = 1, UserId = 10 };
            var expected = new BorrowRecordsDTO { BookId = 1, UserId = 10, IsReturned = true };

            _mockService.Setup(s => s.ReturnBookAsync(dto)).ReturnsAsync(expected);

            var result = await _controller.ReturnBook(dto);

            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(expected, ok.Value);
        }

        [Fact]
        public async Task ReturnBook_ReturnsBadRequest_WhenExceptionThrown()
        {
            var dto = new BorrowCreateDTO { BookId = 1, UserId = 10 };

            _mockService.Setup(s => s.ReturnBookAsync(dto))
                        .ThrowsAsync(new Exception("No active borrow record found."));

            var result = await _controller.ReturnBook(dto);

            var bad = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("No active borrow record found.", bad.Value);
        }


        [Fact]
        public async Task GetBorrowRecords_ReturnsOk_WithRecords()
        {
            int userId = 10;
            var records = new List<BorrowRecordsDTO>
            {
                new BorrowRecordsDTO { BookId = 1, UserId = userId }
            };

            _mockService.Setup(s => s.GetBorrowRecordsAsync(userId)).ReturnsAsync(records);

            var result = await _controller.GetBorrowRecords(userId);

            var ok = Assert.IsType<OkObjectResult>(result);
            var returned = Assert.IsType<List<BorrowRecordsDTO>>(ok.Value);
            Assert.Single(returned);
        }

        [Fact]
        public async Task GetBorrowRecords_ReturnsOk_WithEmptyList_WhenNoRecords()
        {
            int userId = 10;
            var emptyList = new List<BorrowRecordsDTO>();

            _mockService.Setup(s => s.GetBorrowRecordsAsync(userId)).ReturnsAsync(emptyList);

            var result = await _controller.GetBorrowRecords(userId);

            var ok = Assert.IsType<OkObjectResult>(result);
            var returned = Assert.IsType<List<BorrowRecordsDTO>>(ok.Value);
            Assert.Empty(returned);
        }

       

        [Fact]
        public async Task GetBorrowHistory_ReturnsOk_WithHistory()
        {
            var history = new List<BorrowRecordsDTO>
            {
                new BorrowRecordsDTO { BookId = 2, UserId = 3 }
            };

            _mockService.Setup(s => s.GetBorrowHistoryAsync()).ReturnsAsync(history);

            var result = await _controller.GetBorrowHistory();

            var ok = Assert.IsType<OkObjectResult>(result);
            var returned = Assert.IsType<List<BorrowRecordsDTO>>(ok.Value);
            Assert.Single(returned);
        }

        [Fact]
        public async Task GetBorrowHistory_ReturnsOk_WithEmptyList_WhenNoHistory()
        {
            var empty = new List<BorrowRecordsDTO>();

            _mockService.Setup(s => s.GetBorrowHistoryAsync()).ReturnsAsync(empty);

            var result = await _controller.GetBorrowHistory();

            var ok = Assert.IsType<OkObjectResult>(result);
            var returned = Assert.IsType<List<BorrowRecordsDTO>>(ok.Value);
            Assert.Empty(returned);
        }
    }
}
