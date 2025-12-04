// src/pages/AuthorsPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {fetchAuthors,addAuthor,updateAuthor,deleteAuthor} from "../slices/authorSlice";
import { clearMessages } from "../slices/authorSlice";
import bookDetails from "../bookDetails.css";
import AuthorList from "../pages/AuthorList";
import AuthorForm from "../pages/AuthorForm";
import { useNavigate } from "react-router-dom";
export default function AuthorPage() {
    const dispatch = useDispatch();
      const navigate = useNavigate();
    const { list, loading } = useSelector((state) => state.authors);

    const [editingAuthor, setEditingAuthor] = useState(null);
    const [adding, setAdding] = useState(false);
const { successMessage, errorMessage } = useSelector((state) => state.authors);

useEffect(() => {
  if (successMessage || errorMessage) {
    const timer = setTimeout(() => dispatch(clearMessages()), 3000);
    return () => clearTimeout(timer);
  }
}, [successMessage, errorMessage, dispatch]);


    useEffect(() => {
        dispatch(fetchAuthors());
    }, [dispatch]);

    const handleAdd = (data) => {
        dispatch(addAuthor(data));
        setAdding(false);
    };

    const handleEdit = (data) => {
        dispatch(updateAuthor({ id: editingAuthor.authorId, author: data }));
        setEditingAuthor(null);
    };

    const handleDelete = (id) => {
      const role=localStorage.getItem("role");
      console.log("Role:",role);
        dispatch(deleteAuthor(id));
    };

    return (
    <div className="page-bg">
            {successMessage && <div className="toastList success">{successMessage}</div>}
{errorMessage && <div className="toastList error">{errorMessage}</div>}
      <div className="history-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button className="tab-btn" onClick={() => navigate("/books")}>Back to Books</button>
          <h2 className="page-title">Author Management</h2>
          <button className="tab-btn" onClick={() => navigate("/authors/add")}>
            Add New Author
          </button>
        </div>

        {loading && <p>Loading...</p>}

        <AuthorList
          authors={list}
          onEdit={(author) => navigate(`/authors/edit/${author.authorId}`)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}