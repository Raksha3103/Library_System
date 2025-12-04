using Library_Management_System.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Library_Management_System.Config
{
    public class AuthorConfig : IEntityTypeConfiguration<Author>
    {
        public void Configure(EntityTypeBuilder<Author> builder)
        {
            builder.ToTable("Authors");
            builder.HasKey(a => a.AuthorId);

            builder.Property(a => a.FullName)
                   .IsRequired()
                   .HasMaxLength(150);

            builder.Property(a => a.Country)
                   .HasMaxLength(100);

            builder.Property(a => a.Biography)
                   .HasMaxLength(1000);

            //builder.Property(a => a.DateOfBirth)
            //       .IsRequired(false);

            // One Author -> Many Books
            builder.HasMany(a => a.Books)
                   .WithOne(b => b.Author)
                   .HasForeignKey(b => b.AuthorId);

            
            builder.HasData(
                new Author
                {
                    AuthorId = 1,
                    FullName = "J.K. Rowling",
                    Country = "United Kingdom",
                    Biography = "Author of the Harry Potter series.",
                    //DateOfBirth = new DateTime(1965, 7, 31)
                },
                new Author
                {
                    AuthorId = 2,
                    FullName = "George Orwell",
                    Country = "India (British-born)",
                    Biography = "Known for 1984 and Animal Farm.",
                    //DateOfBirth = new DateTime(1903, 6, 25)
                }
            );
        }
    }
}
