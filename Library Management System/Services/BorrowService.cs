using AutoMapper;
using Library_Management_System.Models;
using Library_Management_System.Repository;

public class BorrowService : IBorrowService
{
    private readonly ILibraryRepository<BorrowRecords> _borrowRepo;
    private readonly ILibraryRepository<Books> _bookRepo;
    private readonly ILibraryRepository<User> _userRepo;
    private readonly IMapper _mapper;

    public BorrowService(
        ILibraryRepository<BorrowRecords> borrowRepo,
        ILibraryRepository<Books> bookRepo,
        ILibraryRepository<User> userRepo,
        IMapper mapper)
    {
        _borrowRepo = borrowRepo;
        _bookRepo = bookRepo;
        _userRepo = userRepo;
        _mapper = mapper;
    }

    public async Task<BorrowRecordsDTO> BorrowBookAsync(BorrowCreateDTO dto)
    {
        var book = await _bookRepo.GetByIdAsync(b => b.BookId == dto.BookId);
        if (book == null || book.AvailableCopies <= 0)
            throw new Exception("Book not available.");

        var user = await _userRepo.GetByIdAsync(u => u.userId == dto.UserId);
        if (user == null)
            throw new Exception("User not found.");

        var existingBorrow = await _borrowRepo.GetByIdAsync(b =>
            b.UserId == dto.UserId && b.BookId == dto.BookId && !b.IsReturned);
        if (existingBorrow != null)
            throw new Exception("This user has already borrowed the book.");

        var borrow = new BorrowRecords
        {
            UserId = dto.UserId,
            BookId = dto.BookId,
            BorrowDate = DateTime.Now,
            IsReturned = false,
            User = user,
            Books = book
        };

        await _borrowRepo.AddAsync(borrow);

        book.AvailableCopies--;
        await _bookRepo.UpdateAsync(book);

        return _mapper.Map<BorrowRecordsDTO>(borrow);
    }

    public async Task<BorrowRecordsDTO> ReturnBookAsync(BorrowCreateDTO dto)
    {
        var borrow = await _borrowRepo.GetByIdAsync(b =>
            b.UserId == dto.UserId && b.BookId == dto.BookId && !b.IsReturned);

        if (borrow == null)
            throw new Exception("No active borrow record found.");

        borrow.IsReturned = true;
        borrow.ReturnDate = DateTime.Now;
        await _borrowRepo.UpdateAsync(borrow);

        var book = await _bookRepo.GetByIdAsync(b => b.BookId == dto.BookId);
        if (book != null)
        {
            book.AvailableCopies++;
            await _bookRepo.UpdateAsync(book);
        }

        return _mapper.Map<BorrowRecordsDTO>(borrow);
    }

    public async Task<List<BorrowRecordsDTO>> GetBorrowRecordsAsync(int userId)
    {
        var all = await _borrowRepo.GetAllAsync();

        var records = new List<BorrowRecords>();

        foreach (var r in all.Where(b => b.UserId == userId))
        {
            r.User = await _userRepo.GetByIdAsync(u => u.userId == r.UserId);
            r.Books = await _bookRepo.GetByIdAsync(b => b.BookId == r.BookId, true, b => b.Author);
            records.Add(r);
        }

        return _mapper.Map<List<BorrowRecordsDTO>>(records);
    }

    public async Task<List<BorrowRecordsDTO>> GetBorrowHistoryAsync()
    {
        var all = await _borrowRepo.GetAllAsync();
        foreach (var r in all)
        {
            r.User = await _userRepo.GetByIdAsync(u => u.userId == r.UserId);
            r.Books = await _bookRepo.GetByIdAsync(b => b.BookId == r.BookId, true, b => b.Author);
        }
        return _mapper.Map<List<BorrowRecordsDTO>>(all);
    }
}
