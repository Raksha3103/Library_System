using System;

namespace Library_Management_System.Models
{
    public class BookDTO
    {
        public int BookId { get; set; }
        public string Title { get; set; }
        public string Genre { get; set; }
        public DateTime PublishedDate { get; set; } 
        public int TotalCopies { get; set; }
        public int AvailableCopies { get; set; }
        public int AuthorId { get; set; }
        public string AuthorName { get; set; } 
    }
}
