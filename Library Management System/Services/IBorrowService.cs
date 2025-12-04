using Library_Management_System.Models;

public interface IBorrowService
{
    Task<BorrowRecordsDTO> BorrowBookAsync(BorrowCreateDTO dto);
    Task<BorrowRecordsDTO> ReturnBookAsync(BorrowCreateDTO dto);
    Task<List<BorrowRecordsDTO>> GetBorrowRecordsAsync(int userId);
    Task<List<BorrowRecordsDTO>> GetBorrowHistoryAsync();
}
