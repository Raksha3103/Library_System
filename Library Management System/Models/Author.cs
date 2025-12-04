namespace Library_Management_System.Models
{
    public class Author
    {
        public int AuthorId { get; set; }
        public string FullName { get; set; }
        public string? Country { get; set; }
        public string? Biography { get; set; }
       // public DateTime? DateOfBirth { get; set; }
       // public DateTime CreatedDate { get; set; }
        //public DateTime UpdatedDate { get; set; }

        // Navigation Property
        public ICollection<Books> Books { get; set; }
    }
}
