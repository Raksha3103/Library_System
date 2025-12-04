using AutoMapper;

using Library_Management_System.Models;

namespace Library_Management_System.Config
{
    
        public class AutoMapperConfig : Profile
        {
            public AutoMapperConfig()
            {
            CreateMap<Books, BookDTO>()
     .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src => src.Author.FullName));

            CreateMap<BookDTO, Books>();
            CreateMap<UserCreateDTO, User>().ReverseMap();

            CreateMap<Author, AuthorDTO>().ReverseMap();
            CreateMap<User, UserDTO>().ReverseMap();

            CreateMap<BorrowRecords, BorrowRecordsDTO>()
    .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.name))
       .ForMember(dest => dest.BookTitle, opt => opt.MapFrom(src => src.Books.Title));

            CreateMap<BorrowCreateDTO, BorrowRecords>();


        }
    }
    }

