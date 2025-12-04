using Library_Management_System.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Library_Management_System.Config
{
    public class BookConfig : IEntityTypeConfiguration<Books>
    {
        public void Configure(EntityTypeBuilder<Books> builder)
        {
            builder.ToTable("Books");
            builder.HasKey(b => b.BookId);
            builder.Property(b => b.BookId).UseIdentityColumn();

            builder.Property(b => b.Title).IsRequired().HasMaxLength(200);
            builder.Property(b => b.PublishedDate).IsRequired(); 

            builder.Property(b => b.Genre).HasMaxLength(100);
            builder.Property(b => b.TotalCopies).IsRequired();
            builder.Property(b => b.AvailableCopies).IsRequired();
            builder.Property(b => b.CreatedDate).HasDefaultValueSql("GETUTCDATE()");
            builder.Property(b => b.UpdatedDate).HasDefaultValueSql("GETUTCDATE()");

           
            builder.HasOne(b => b.Author)
                   .WithMany(a => a.Books)
                   .HasForeignKey(b => b.AuthorId)
                   .OnDelete(DeleteBehavior.Cascade);
            builder.HasData(
    new Books
    {
        BookId = 1,
        Title = "Harry Potter and the Sorcerer's Stone",
        PublishedDate = new DateTime(1997, 6, 26),
        Genre = "Fantasy",
        TotalCopies = 10,
        AvailableCopies = 10,
        AuthorId = 1, 
        CreatedDate = new DateTime(2025, 10, 9),
        UpdatedDate = new DateTime(2025, 10, 9)
    },
    new Books
    {
        BookId = 2,
        Title = "1984",
        PublishedDate = new DateTime(1949, 6, 8),
        Genre = "Dystopian",
        TotalCopies = 8,
        AvailableCopies = 8,
        AuthorId = 2, 
        CreatedDate = new DateTime(2025, 10, 9),
        UpdatedDate = new DateTime(2025, 10, 9)
    }
);
        }
    }
}
