using Library_Management_System.Config;
using Library_Management_System.Configurations;
using Library_Management_System.Models;
using Microsoft.EntityFrameworkCore;

namespace Library_Management_System.Data
{
    public class BookDbContext : DbContext
    {
        public BookDbContext(DbContextOptions<BookDbContext> options)
            : base(options) { }

        public DbSet<Books> Books { get; set; }
        public DbSet<Author> Authors { get; set; }
        //public DbSet<BorrowRecord> BorrowRecords { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new BookConfig());
            modelBuilder.ApplyConfiguration(new AuthorConfig());
            modelBuilder.ApplyConfiguration(new UserConfig());
            modelBuilder.ApplyConfiguration(new BorrowRecordsConfig());
            // modelBuilder.ApplyConfiguration(new BorrowRecordConfig());
        }
    }
}
