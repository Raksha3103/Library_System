using AutoMapper;
using FluentAssertions;
using Library_Management_System.Models;
using Library_Management_System.Repository;
using Library_Management_System.Services;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Xunit;

public class BorrowServiceTests
{
    private readonly Mock<ILibraryRepository<BorrowRecords>> _borrowRepoMock;
    private readonly Mock<ILibraryRepository<Books>> _bookRepoMock;
    private readonly Mock<ILibraryRepository<User>> _userRepoMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly BorrowService _service;

    public BorrowServiceTests()
    {
        _borrowRepoMock = new Mock<ILibraryRepository<BorrowRecords>>();
        _bookRepoMock = new Mock<ILibraryRepository<Books>>();
        _userRepoMock = new Mock<ILibraryRepository<User>>();
        _mapperMock = new Mock<IMapper>();

        _service = new BorrowService(
            _borrowRepoMock.Object,
            _bookRepoMock.Object,
            _userRepoMock.Object,
            _mapperMock.Object
        );
    }

    private void MockUser(User user) =>
        _userRepoMock.Setup(m => m.GetByIdAsync(
            It.IsAny<Expression<Func<User, bool>>>(),
            It.IsAny<bool>(),
            It.IsAny<Expression<Func<User, object>>[]>()))
        .ReturnsAsync(user);

    private void MockBook(Books book) =>
        _bookRepoMock.Setup(m => m.GetByIdAsync(
            It.IsAny<Expression<Func<Books, bool>>>(),
            It.IsAny<bool>(),
            It.IsAny<Expression<Func<Books, object>>[]>()))
        .ReturnsAsync(book);

    private void MockBorrow(BorrowRecords record) =>
        _borrowRepoMock.Setup(m => m.GetByIdAsync(
            It.IsAny<Expression<Func<BorrowRecords, bool>>>(),
            It.IsAny<bool>(),
            It.IsAny<Expression<Func<BorrowRecords, object>>[]>()))
        .ReturnsAsync(record);

    
    [Fact]
    public async Task BorrowBook_ShouldBorrow_WhenValid()
    {
        var dto = new BorrowCreateDTO { UserId = 1, BookId = 5 };
        var book = new Books { BookId = 5, AvailableCopies = 1 };
        var user = new User { userId = 1 };

        MockBook(book);
        MockUser(user);
        MockBorrow(null);

        _mapperMock.Setup(m => m.Map<BorrowRecordsDTO>(It.IsAny<BorrowRecords>()))
            .Returns(new BorrowRecordsDTO());

        var result = await _service.BorrowBookAsync(dto);

        result.Should().NotBeNull();
        book.AvailableCopies.Should().Be(0);
        _borrowRepoMock.Verify(m => m.AddAsync(It.IsAny<BorrowRecords>()), Times.Once);
    }

    [Fact]
    public async Task BorrowBook_ShouldThrow_WhenBookUnavailable()
    {
        var dto = new BorrowCreateDTO { BookId = 3 };
        MockBook(new Books { AvailableCopies = 0 });

        var act = async () => await _service.BorrowBookAsync(dto);

        await act.Should().ThrowAsync<Exception>().WithMessage("Book not available.");
    }

    [Fact]
    public async Task BorrowBook_ShouldThrow_WhenUserNotFound()
    {
        var dto = new BorrowCreateDTO { UserId = 3, BookId = 10 };
        MockBook(new Books { AvailableCopies = 1 });
        MockUser(null);

        var act = async () => await _service.BorrowBookAsync(dto);

        await act.Should().ThrowAsync<Exception>().WithMessage("User not found.");
    }

    [Fact]
    public async Task BorrowBook_ShouldThrow_WhenAlreadyBorrowed()
    {
        var dto = new BorrowCreateDTO { UserId = 2, BookId = 7 };
        MockBook(new Books { AvailableCopies = 1 });
        MockUser(new User { userId = 2 });
        MockBorrow(new BorrowRecords());

        var act = async () => await _service.BorrowBookAsync(dto);

        await act.Should().ThrowAsync<Exception>()
            .WithMessage("This user has already borrowed the book.");
    }

   
    [Fact]
    public async Task ReturnBook_ShouldReturn_WhenValid()
    {
        var dto = new BorrowCreateDTO { UserId = 1, BookId = 2 };
        var record = new BorrowRecords { UserId = 1, BookId = 2, IsReturned = false };
        var book = new Books { BookId = 2, AvailableCopies = 2 };

        MockBorrow(record);
        MockBook(book);

        _mapperMock.Setup(m => m.Map<BorrowRecordsDTO>(record))
            .Returns(new BorrowRecordsDTO());

        var result = await _service.ReturnBookAsync(dto);

        result.Should().NotBeNull();
        book.AvailableCopies.Should().Be(3);
        record.IsReturned.Should().BeTrue();
        _borrowRepoMock.Verify(m => m.UpdateAsync(record), Times.Once);
    }

    [Fact]
    public async Task ReturnBook_ShouldThrow_WhenNoActiveRecord()
    {
        var dto = new BorrowCreateDTO { UserId = 1, BookId = 9 };
        MockBorrow(null);

        var act = async () => await _service.ReturnBookAsync(dto);

        await act.Should().ThrowAsync<Exception>()
            .WithMessage("No active borrow record found.");
    }

    [Fact]
    public async Task GetBorrowRecords_ShouldReturnMappedList()
    {
        var list = new List<BorrowRecords>
        {
            new BorrowRecords { UserId = 1, BookId = 11 }
        };

        _borrowRepoMock.Setup(m => m.GetAllAsync()).ReturnsAsync(list);
        MockUser(new User());
        MockBook(new Books());

        _mapperMock.Setup(m => m.Map<List<BorrowRecordsDTO>>(It.IsAny<List<BorrowRecords>>()))
            .Returns(new List<BorrowRecordsDTO> { new BorrowRecordsDTO() });

        var result = await _service.GetBorrowRecordsAsync(1);

        result.Should().HaveCount(1);
    }

    [Fact]
    public async Task GetBorrowHistory_ShouldReturnMappedList()
    {
        var list = new List<BorrowRecords>
        {
            new BorrowRecords { UserId = 2, BookId = 12 }
        };

        _borrowRepoMock.Setup(m => m.GetAllAsync()).ReturnsAsync(list);
        MockUser(new User());
        MockBook(new Books());

        _mapperMock.Setup(m => m.Map<List<BorrowRecordsDTO>>(It.IsAny<List<BorrowRecords>>()))
            .Returns(new List<BorrowRecordsDTO> { new BorrowRecordsDTO() });

        var result = await _service.GetBorrowHistoryAsync();

        result.Should().HaveCount(1);
    }
}
