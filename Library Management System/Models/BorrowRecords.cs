using Library_Management_System.Models;

namespace Library_Management_System.Models
{
    public class BorrowRecords
    {
        public int BorrowId { get; set; }
        public int UserId { get; set; }
        public int BookId { get; set; }
        public DateTime? BorrowDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public bool IsReturned { get; set; }
        public Author? Author { get; set; }

        public Books? Books { get; set; }

        public User? User { get; set; }

        // public DateTime? DateOfBirth { get; set; }
        // public DateTime CreatedDate { get; set; }
        //public DateTime UpdatedDate { get; set; }

        // Navigation Property

    }
}

