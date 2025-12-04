namespace Library_Management_System.Models
{
    public class User
    {

        public int userId { get; set; }
        public string name { get; set; }

        public string email { get; set; }

        public string? passwordHash { get; set; }

       public string phoneNumber { get; set; }

        public string role { get; set; }
        public ICollection<BorrowRecords> BorrowRecords { get; set; }

    }
}
