import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBook, updateBook, fetchBookById } from "../slices/bookSlice";
import { fetchAuthors } from "../slices/authorSlice";
import { useNavigate, useParams } from "react-router-dom";
import { clearMessages } from "../slices/bookSlice";
import Books from "../Books.css";  
export default function BookForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
const { successMessage, errorMessage } = useSelector((state) => state.books);

  const isEditMode = Boolean(id);

  const { selectedBook } = useSelector((state) => state.books);
  const { list: authors } = useSelector((state) => state.authors);

  const [form, setForm] = useState({
    title: "",
    genre: "",
    publishedDate: "",
    totalCopies: "",
    availableCopies: "",
    authorId: "",
   // authorName: ""  
  });

  useEffect(() => {
    dispatch(fetchAuthors());
    if (isEditMode) dispatch(fetchBookById(id));
  }, [id]);

  useEffect(() => {
    if (isEditMode && selectedBook) {
      setForm({
        title: selectedBook.title,
        genre: selectedBook.genre,
        publishedDate: selectedBook.publishedDate?.substring(0, 10),
        totalCopies: selectedBook.totalCopies,
        availableCopies: selectedBook.availableCopies,
        authorId: selectedBook.authorId,
       // authorName: "" 
      });
    }
  }, [selectedBook]);
useEffect(() => {
  if (successMessage || errorMessage) {
    const timer = setTimeout(() => dispatch(clearMessages()), 3000);
    return () => clearTimeout(timer);
   
  }
   
}, [successMessage, errorMessage]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // const handleCopiesChange = (e) => {
  //   const value = e.target.value;
  //   if (/^\d*$/.test(value)) {
  //     setForm({
  //       ...form,
  //       totalCopies: value,
  //       availableCopies: value  
  //     });
  //   }
  // };
const handleCopiesChange = (e) => {
  const newTotal = Number(e.target.value);

  if (/^\d*$/.test(e.target.value)) {
    setForm((prev) => {
      const oldTotal = Number(prev.totalCopies);
      const oldAvailable = Number(prev.availableCopies);

      const difference = newTotal - oldTotal;
      const updatedAvailable = oldAvailable + difference;

      return {
        ...prev,
        totalCopies: newTotal,
        availableCopies: updatedAvailable
      };
    });
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalData = {
      ...form,
      totalCopies: Number(form.totalCopies),
      availableCopies: Number(form.availableCopies),
      authorId: Number(form.authorId),
      authorName: ""   
    };

    if (isEditMode) {
       const deleteConfirm=window.confirm("Are you sure you want to update this book?");
      if(!deleteConfirm){
        return;
      }
       dispatch(updateBook({ id, book: finalData }));
    } else {
       dispatch(addBook(finalData));
      
    }

    
  };

  return (
     <div className="page-container">
      {successMessage && (
  <div className="toastForm success">
    {successMessage}
  </div>
)}

{errorMessage && (
  <div className="toastForm error">
    {errorMessage}
  </div>
)}

      <div className="form-card">
      <h2 className="form-title">{isEditMode ? "Edit Book" : "Add New Book"}</h2>

      <form className="grid-form" onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        
        <label htmlFor="title">Title:</label>
        <input id="title" name="title" value={form.title} onChange={handleChange} required />

       
        <label htmlFor="authorId">Author:</label>
        <select
        id="authorId"
          name="authorId"
          value={form.authorId}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Author --</option>
          {authors.map((author) => (
            <option key={author.authorId} value={author.authorId}>
              {author.fullName}
            </option>
          ))}
        </select>

        <label htmlFor="genre">Genre:</label>
        <input id="genre" name="genre" value={form.genre} onChange={handleChange} required />

        <label htmlFor="totalCopies">Total Copies:</label>
        <input id="totalCopies"
          name="totalCopies"
          type="number"
          inputMode="numeric"
          value={form.totalCopies}
          onChange={handleCopiesChange}
          required
        />

        <label htmlFor="availableCopies">Available Copies:</label>
        <input id="availableCopies"
          name="availableCopies"
          type="number"
          value={form.availableCopies}
          readOnly
        />

        <label htmlFor="publishedDate">Published Date:</label>
        <input id="publishedDate"
          name="publishedDate"
          type="date"
          value={form.publishedDate}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn-submit">
          {isEditMode ? "Update Book" : "Add Book"}
        </button>
      </form>
    </div>
    </div>
  );
}
