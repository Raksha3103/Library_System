import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../slices/bookSlice";
import { Link } from "react-router-dom";
import { fetchBookByName ,getBooksOfAuthor} from "../slices/bookSlice";
import { clearMessages } from "../slices/bookSlice";
import bookDetails from "../bookDetails.css";
import { logoutUser } from "../slices/loginSlice";
import { useNavigate, useParams } from "react-router-dom";
import { clearUserNotifications } from "../slices/RequestSlice";
import { clearLoginError } from "../slices/loginSlice";
import { fetchRequests } from "../slices/RequestSlice";
import { clearMessages as clearRequestMessages } from "../slices/RequestSlice";
export default function Books() {
  const role = localStorage.getItem("role");
const userId = localStorage.getItem("userId");
  const { requests,notifications  } = useSelector((state) => state.requests);
    const dispatch = useDispatch();
    const { list} = useSelector((state) => state.books);
    const [search,setSearch]=useState("");
const [searchByAuthor,setSearchByAuthor]=useState("");
const myNotifications = notifications.filter(n => n.userId === userId);
const { successMessage: bookSuccess, errorMessage: bookError } = useSelector((state) => state.books);
const { successMessage, errorMessage } = useSelector((state) => state.requests);
//const myAlerts = clearUserNotifications.filter(n => n.userId === userId);
// const [inputError,setInputError]=useState(""); 
const navigate=useNavigate();
useEffect(() => {
  
 // dispatch(clearRequestMessages());
  dispatch(clearMessages());
}, [dispatch]);
// useEffect(() => {
//   dispatch(clearLoginError());
// }, []);
useEffect(() => {
  if (userId) {
    dispatch(fetchRequests());
  }
}, []);
useEffect(() => {
  if (successMessage || errorMessage) {
    const timer = setTimeout(() => dispatch(clearRequestMessages()), 2000);
    return () => clearTimeout(timer);
  }
}, [successMessage, errorMessage, dispatch]);


 
    useEffect(() => {
        dispatch(fetchBooks());
    }, [dispatch]);
//    useEffect(() => {
//   const token = localStorage.getItem("token");
// //   if (!token) {
// //     navigate("/login");
// //   }
// // }, [navigate]);
// useEffect(() => {
//   if (notifications.length > 0) {
//     const timer = setTimeout(() => {
//       dispatch(clearUserNotifications(Number(userId))); // ensure userId is a number
//     }, 2000); // hide after 5 seconds
//     return () => clearTimeout(timer);
//   }
// }, [notifications, dispatch, userId]);
    

    useEffect(() => {
     
      if (bookError) {
        setTimeout(() => dispatch(clearMessages()), 2000);
      }
    }, [bookError]);

useEffect(()=>{
 const handleSearch=setTimeout(()=>{
 if(search.trim()!==""){
    dispatch(fetchBookByName(search));  
  
    } else {    
    dispatch(fetchBooks()); 
    
    }
  },500);
  return()=>clearTimeout(handleSearch);
},[search,dispatch]);


useEffect(() => {
  const handleAuthorBooks = setTimeout(() => {
    if (searchByAuthor.trim() !== "") {
      dispatch(getBooksOfAuthor(searchByAuthor));
    } else {
      dispatch(fetchBooks());
    }
  }, 500);

  return () => clearTimeout(handleAuthorBooks);
}, [searchByAuthor, dispatch]);
// useEffect(() => {
//   if (myNotifications.length > 0) {
//     const timer = setTimeout(() => {
//       dispatch(clearUserNotifications(userId));
//     }, 2500);
//     return () => clearTimeout(timer);
//   }
// }, [myNotifications.length, dispatch, userId]);

 

   return (
  <div className="app-layout">

    {/* NAVBAR */}
    <header className="navbar-books">
      <div className="logo-section" onClick={() => navigate("/")}>
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/004/297/596/small/education-logo-open-book-dictionary-textbook-or-notebook-with-sunrice-icon-modern-emblem-idea-concept-design-for-business-libraries-schools-universities-educational-courses-vector.jpg"
             alt="Library Logo" className="logo-img" />
        <span className="logo-text">Library System</span>
      </div>

      <nav className="nav-links">
        <button onClick={() => navigate("/")}>Home</button>
        {role !== "Admin" && <button onClick={() => navigate("/requests")}>My Requests</button>}
        {role !== "Admin" && <button onClick={() => navigate("/borrow/history")}>Borrow History</button>}
        {role === "Admin" && <button onClick={() => navigate("/books/add")}>Add Book</button>}
        {role === "Admin" && <button onClick={() => navigate("/admin-borrow-history")}>Borrow History</button>}
        {role === "Admin" && <button onClick={() => navigate("/admin/requests")}>Pending Requests</button>}
        {role === "Admin" && <button onClick={() => navigate("/authors")}>Author Details</button>}
      </nav>

      <button
        className="logout-btn"
        onClick={() => {
          dispatch(logoutUser());
          localStorage.clear();
          navigate("/login", { replace: true });
        }}
      >
        Logout
      </button>
    </header>

    {/* CONTENT */}
    <div className="page-content">

      {/* 🔔 SUCCESS / ERROR TOASTS */}
      {role !== "Admin" && successMessage && (
        <div className="toast success">
          <span className="toast-icon">✔️</span>
          {successMessage}
        </div>
      )}

      {role !== "Admin" && errorMessage && (
        <div className="toast error">
          <span className="toast-icon">❌</span>
          {errorMessage}
        </div>
      )}

      {bookError && (
        <div className="toast warning">
          <span className="toast-icon">⚠️</span>
          {bookError}
        </div>
      )}

      {/* SEARCH */}
      <div className="search-wrapper">
        <input type="text" placeholder="Search by Book Name"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setSearchByAuthor(""); }} />

        <input type="text" placeholder="Search by Author"
          value={searchByAuthor}
          onChange={(e) => { setSearchByAuthor(e.target.value); setSearch(""); }} />
      </div>

      {/* BOOK GRID */}
      <div className="book-container">
        {list.map(book => (
          // <div key={book.bookId} className="book-item">
          //   {/* <img src={book.coverImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaMTr4mzPnBMI5pLjiKto1ZmQ1WhgIPGJpPg&s"} alt="book" className="book-img" /> */}
          //   <h3>{book.title}</h3>
          //   {/* <p>👤 {book.authorName}</p>
          //   <p>📖 Genre: {book.genre}</p>
          //   <p>📚 Available: {book.availableCopies}</p> */}
          //   <Link to={`/books/${book.bookId}`}>
          //     <button className="details-btn">View Details</button>
          //   </Link>
        //  </div>

        <div className="book-card1" key={book.bookId}>
  <div className="book-img-wrapper">
    <img
      src={book.coverImage || "https://thumbs.dreamstime.com/b/open-book-logo-icon-knowledge-education-literature-library-school-384439715.jpg"}
      alt="book"
    />
  </div>

  <div className="book-info">
    <h3>{book.title}</h3>
    <p className="members">{book.genre}</p>

    <Link to={`/books/${book.bookId}`}>
      <button className="join-btn">View Details</button>
    </Link>
  </div>
</div>

        ))}
      </div>

    </div>
  </div>
);

}
