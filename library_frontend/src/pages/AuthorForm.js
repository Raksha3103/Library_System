import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addAuthor, updateAuthor, fetchAuthors } from "../slices/authorSlice";
import Books from "../Books.css";

export default function AuthorForm() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const dispatch = useDispatch();
  const authors = useSelector((state) => state.authors.list);

  const [form, setForm] = useState({
    fullName: "",
    country: "",
    biography: ""
  });

  useEffect(() => {
    if (!authors.length) dispatch(fetchAuthors()); 

    if (id && authors.length) {
      const author = authors.find((a) => a.authorId === Number(id));
      if (author) setForm(author);
    }
  }, [id, authors, dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      dispatch(updateAuthor({ id: Number(id), author: form }));
    } else {
      dispatch(addAuthor(form));
    }
    navigate("/authors"); 
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h3 className="form-title">{id ? "Edit Author" : "Add Author"}</h3>
        <form onSubmit={handleSubmit} className="grid-form">
          <label>Full Name:</label>
          <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />

          <label>Country:</label>
          <input type="text" name="country" value={form.country} onChange={handleChange} />

          <label>Biography:</label>
          <input name="biography" value={form.biography} onChange={handleChange}></input>

          <button type="submit" className="btn-submit">Submit</button>
          <button
            type="button"
            className="btn-submit"
            style={{ background: "#ff4444", marginLeft: "10px" }}
            onClick={() => navigate("/authors")}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
