// src/components/AuthorList.jsx
import React from "react";
import borrow from "../borrow.css";
export default function AuthorList({ authors, onEdit, onDelete }) {
    
    if (!authors || authors.length === 0) {
    return <p className="no-data">No authors found.</p>;
  }
    
    
    return (
        <table className="history-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Country</th>
                    <th>Biography</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {authors.map((author) => (
                    <tr key={author.authorId}>
                        <td>{author.authorId}</td>
                        <td>{author.fullName}</td>
                        <td>{author.country}</td>
                        <td>{author.biography}</td>
                        <td>
                            <button className="tab-btn" onClick={() => onEdit(author)}>Edit</button>
                            <button
                                className="tab-btn" onClick={() => onDelete(author.authorId)}
                                style={{ marginLeft: "10px", background: "red", color: "white" }}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
