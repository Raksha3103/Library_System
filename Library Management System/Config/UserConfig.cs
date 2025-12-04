using Library_Management_System.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Library_Management_System.Config
{
    public class UserConfig : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");

            builder.HasKey(u => u.userId);
            builder.Property(u => u.userId)
                   .ValueGeneratedOnAdd() 
                   .UseIdentityColumn();

            builder.Property(u => u.name)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(u => u.email)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(u => u.phoneNumber)
                   .HasMaxLength(15);

       builder.Property(u => u.role)
                   .IsRequired()
                   .HasMaxLength(20);

            builder.Property(u => u.passwordHash)
                   .IsRequired(false)
                   .HasMaxLength(255); 

            builder.HasMany(u => u.BorrowRecords)
                   .WithOne(b => b.User)
                   .HasForeignKey(b => b.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

           
            builder.HasData(
                new User
                {
                    userId = 1,
                    name = "Admin User",
                    email = "admin@library.com",
                    phoneNumber = "9999999999",
                    role = "Admin",
                    passwordHash = "admin123" 
                },
                new User
                {
                    userId = 2,
                    name = "John Reader",
                    email = "john@library.com",
                    phoneNumber = "8888888888",
                    role = "User",
                    passwordHash = null
                }
            );
        }
    }
}
