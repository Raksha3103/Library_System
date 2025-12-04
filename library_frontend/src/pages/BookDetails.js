import { useEffect ,useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams,useNavigate } from "react-router-dom";
import { fetchBookById } from "../slices/bookSlice";
import { deleteBook } from "../slices/bookSlice";
import { updateBook } from "../slices/bookSlice";
import { bookBorrowed, bookReturned } from "../slices/BorrowSlice";
import { clearMessages as clearBorrowMessages } from "../slices/BorrowSlice"; 
import { clearMessages as clearBookMessages } from "../slices/bookSlice";
import bookDetails from "../bookDetails.css";
import { addRequest } from "../slices/RequestSlice";
import { clearMessages as clearRequestMessages } from "../slices/bookSlice";
import { fetchRequests } from "../slices/RequestSlice";
import { FiTrash2, FiEdit, FiShoppingCart, FiRotateCcw } from "react-icons/fi";

export default function BookDetails() {
  const { successMessage, errorMessage } = useSelector((state) => state.borrow);
const { successMessage: bookSuccess, errorMessage: bookError } = useSelector((state) => state.books);  
  const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
const userId = localStorage.getItem("userId"); 
    const { selectedBook, loading } = useSelector((state) => state.books);
    const { requests } = useSelector((state) => state.requests); 
const role = localStorage.getItem("role"); 
const [popupMessage, setPopupMessage] = useState("");
const [showPopup, setShowPopup] = useState(false);
// "admin"
    useEffect(() => {
     
        dispatch(fetchBookById(id));
    }, [id]);
useEffect(() => {
  if (bookSuccess) {
    const timer = setTimeout(() => {
      dispatch(clearBookMessages());
      navigate("/books");
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [bookSuccess]);
const showNotification = (msg) => {
  setPopupMessage(msg);
  setShowPopup(true);
};


  //   const handleBorrow = async () => {
  //      const deleteBorrow=window.confirm("Are you sure you want to borrow this book?");
  //     if(!deleteBorrow){
  //       return;
  //     }
  //   await dispatch(bookBorrowed({ bookId: Number(id), userId: Number(userId) }));
  //   dispatch(fetchBookById(id)); 
  // };

  // const handleReturn = async () => {
  //    const deleteConfirm=window.confirm("Are you sure you want to return this book?");
  //     if(!deleteConfirm){
  //       return

  //             }        await dispatch(bookReturned({ bookId: Number(id), userId: Number(userId) }));
  //   dispatch(fetchBookById(id)); 
  // };
const handleBorrow = () => {
  const userRequests = requests
    .filter(r => r.userId === Number(userId) && r.bookId === Number(id))
    .sort((a, b) => new Date(b.date) - new Date(a.date)); 
const lastRequest = userRequests[userRequests.length-1]; 
if (lastRequest) {
    if (lastRequest.type === "Borrow" && lastRequest.status === "Pending") {
     showNotification("You already requested for this book. Please wait for approval!");
      return;
    }
if (lastRequest.type === "Borrow" && lastRequest.status === "Approved") {
      showNotification("You already borrowed this book. Please return it first!");
      return;
    }
if (lastRequest.type === "Return" && lastRequest.status === "Pending") {
     showNotification("You already requested to return. Please wait for approval!");
      return;
    }
  }
  if (selectedBook.availableCopies <= 0) {
    showNotification("No copies available!");
    return;
  }
dispatch(
    addRequest({
      userId: Number(userId),
      bookId: Number(id),
      bookTitle: selectedBook.title,
      type: "Borrow",
      userName: localStorage.getItem("name"),
       date: new Date().toISOString(),
    })
  );
  dispatch(fetchRequests());
  showNotification("Borrow request submitted! Waiting for admin approval.");
};


const handleReturn = () => {
  const userBookRequests = requests
    .filter(
      (r) => r.userId === Number(userId) && r.bookId === Number(id)
    ).sort((a, b) => new Date(b.date) - new Date(a.date)); 

  const lastRequest = userBookRequests[userBookRequests.length-1]; 
  
  if (!lastRequest || lastRequest.type === "Return" && lastRequest.status === "Approved") {
    showNotification("You cannot return a book you haven’t borrowed!");
    return;
  }
 if (lastRequest.type === "Return" && lastRequest.status === "Pending") {
    showNotification("You already requested for this return. Please wait for the approval!");
    return;
  }
  if (lastRequest.type === "Return" && lastRequest.status === "Approved") {
   showNotification("You have already returned this book!");
    return;
  }
if (lastRequest.type === "Borrow" && lastRequest.status === "Approved") {
    dispatch(
      addRequest({
        userId: Number(userId),
        bookId: Number(id),
        bookTitle: selectedBook.title,
        type: "Return",
        userName: localStorage.getItem("name"),
        date: new Date().toISOString(),
      })
    );
    dispatch(fetchRequests());
   showNotification("Return request submitted! Waiting for admin approval.");
    return;
  }
if (lastRequest.type === "Borrow" && lastRequest.status === "Pending") {
   showNotification("You havent borrowed this book yet. Borrow request still pending!");
    return;
  }
};
const handleDelete = async () => {
      const deleteConfirm=window.confirm("Are you sure you want to delete this book?");
      if(!deleteConfirm){
        return;
      }
    await dispatch(deleteBook(id));
    // navigate("/books"); 
  };
  const handleEdit=async()=>{
     const deleteConfirm=window.confirm("Are you sure you want to update this book?");
      if(!deleteConfirm){
        return;
      }
    await dispatch(updateBook(id));
    // navigate(`/books/edit/${id}`);
  }

useEffect(() => {
  if (successMessage || errorMessage) {
    setTimeout(() => dispatch(clearBorrowMessages()), 2000);
  }
  if (bookSuccess || bookError) {
    setTimeout(() => dispatch(clearBookMessages()), 2000);
  }
}, [successMessage, errorMessage, bookSuccess, bookError]);
    if (loading || !selectedBook) return <p>Loading...</p>;

    return (
        <div className="page-bg">
         
    <div className="details-container">
      {showPopup && (
  <div className="custom-popup">
    <p>{popupMessage}</p>
    <button onClick={() => setShowPopup(false)}>Close</button>
  </div>
)}

           {successMessage && <div className="toast success">{successMessage}</div>}
{errorMessage && <div className="toast error">{errorMessage}</div>}
{bookSuccess && <div className="toast success">{bookSuccess}</div>}
      {bookError && <div className="toast error">{bookError}</div>}
            <h2 className="details-title">{selectedBook.title}</h2>
             <div className="details-info">
            <p><b>Author:</b> {selectedBook.authorName}</p>
            <p><b>Genre:</b> {selectedBook.genre}</p>
            <p><b>Total Copies:</b> {selectedBook.totalCopies}</p>
            <p><b>Available Copies:</b> {selectedBook.availableCopies}</p>
            <p><b>Published Date:</b> {selectedBook.publishedDate}</p>
            </div>
            <div className="action-buttons1">
      {role!=="Admin" &&<button className="btn borrow-btn" onClick={handleBorrow} disabled={selectedBook.availableCopies <= 0}>
    <FiShoppingCart />    Borrow
      </button>}
 {role!=="Admin" && <button className="btn return-btn" onClick={handleReturn}>
<FiRotateCcw />Return
      </button>}

          {role === "Admin" && (      <button className="btn delete-btn" onClick={handleDelete} style={{ background: "red", color: "white" }}><FiTrash2 />
        Delete
      </button>)}
   {role === "Admin" && (    <button className="btn modify-btn"
  onClick={() => navigate(`/books/edit/${id}`)}
  style={{ background: "yellow", color: "black" }}
><FiEdit />
  Modify
</button>)}
</div>
        </div>
        </div>
    );
}
