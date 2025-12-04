import { Link } from "react-router-dom";
import "../homePage.css";

export default function HomePage() {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  // Dummy books data
  const books = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk7STEAc4mfQiJl8IC1oyK_0kcwIf-s7X3YA&s" },
    { id: 2, title: "1984", author: "George Orwell", image: "https://www.bookgeeks.in/wp-content/uploads/2021/07/1984-by-George-Orwell-1.jpg" },
    { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee", image: "https://m.media-amazon.com/images/I/91DdWTY8R9L._AC_UF1000,1000_QL80_.jpg" },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen", image: "https://www.gutenberg.org/cache/epub/11/pg11.cover.medium.jpg" },
    { id: 5, title: "The Hobbit", author: "J.R.R. Tolkien", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKY54sr50ZyjarYyRuGcKfm0Kz1LjDVvV91g&s" },
  ];

  return (
    <div className="home-container">
      {/* NAVBAR */}
      <nav className="navbar">
       <div className="logo">
    <img
      src="https://static.vecteezy.com/system/resources/thumbnails/004/297/596/small/education-logo-open-book-dictionary-textbook-or-notebook-with-sunrice-icon-modern-emblem-idea-concept-design-for-business-libraries-schools-universities-educational-courses-vector.jpg"
      alt="Library Logo"
      className="logo-img"
    />
    Library
  </div>
        <ul className="nav-links">
          {!token ? (
            <>
              <li><Link className="login-btn" to="/login">Login</Link></li>
            </>
          ) : null}
            {token && (
          <li className="greet-hero">
            <img src="https://i.pravatar.cc/50?u=12345" alt="User Avatar" />
            <span>Hello, {name}</span>
          </li>
        )}
        </ul>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <h1>Cloud Library System</h1>
        <p>Your reading has never looked so good.</p>
        <p>Books, Journals, Novels, and Research Papers.</p>

      

        <Link
          className="hero-btn"
          to={token ? "/books" : "/register"}
        >
          {token ? "Explore Books" : "Get Started"}
        </Link>
      </section>

      {/* BOOK GRID SECTION */}
      <section className="books-section">
        <h2>Featured Books</h2>
        <div className="books-grid">
          {books.map(book => (
            <div className="book-card" key={book.id}>
              <img src={book.image} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
