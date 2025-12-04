namespace Library_Management_System.Models
{
    public class BorrowRecordsDTO
    {
        public int BorrowId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public int BookId { get; set; }
        public string BookTitle { get; set; }
        public DateTime BorrowDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public bool IsReturned { get; set; }
    }
}
