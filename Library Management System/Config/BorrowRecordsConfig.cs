using Library_Management_System.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Library_Management_System.Configurations
{
    public class BorrowRecordsConfig : IEntityTypeConfiguration<BorrowRecords>
    {
        public void Configure(EntityTypeBuilder<BorrowRecords> builder)
        {
            builder.ToTable("BorrowRecords");

            builder.HasKey(b => b.BorrowId);

            builder.Property(b => b.BorrowId)
                   .ValueGeneratedOnAdd();

            builder.Property(b => b.BorrowDate)
                   .IsRequired();

            builder.Property(b => b.ReturnDate)
                   .IsRequired(false);

            builder.Property(b => b.IsReturned)
                   .HasDefaultValue(false);

      
            builder.HasOne(b => b.User)
                   .WithMany(u => u.BorrowRecords)
                   .HasForeignKey(b => b.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(b => b.Books)
                   .WithMany(bk => bk.BorrowRecords)
                   .HasForeignKey(b => b.BookId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
