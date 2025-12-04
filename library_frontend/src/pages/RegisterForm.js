// src/components/AuthorForm.jsx
import React, { useState, useEffect } from "react";
import { useDispatch ,useSelector} from "react-redux";
import { addUser } from "../slices/userSlice";
import Books from "../Books.css";  
import bookDetails from "../bookDetails.css";
import { clearMessages } from "../slices/userSlice";
import { useNavigate } from "react-router-dom";
// import register from "../register.css"
export default function RegisterForm({ initialData }) {
    const [form, setForm] = useState({
          name: "",
  email: "",
  password: "",
  phoneNumber: "",
  role: ""
    });
const dispatch = useDispatch();
const { successMessage, errorMessage,loading } = useSelector((state) => state.user);
    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        }
    }, [initialData]);
const navigate=useNavigate();
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
  e.preventDefault(); 
   if (form.phoneNumber.length !== 10) {
    alert("Please enter 10 numbers");
    return; 
  }
  const resultAction = await dispatch(addUser(form));
  // navigate("/login");
  console.log(resultAction); 
};


    
useEffect(() => {
  if (successMessage || errorMessage) {
    setTimeout(() => {
      dispatch(clearMessages());
      if (errorMessage) {
        setForm({
          name: "",
          email: "",
          password: "",
          phoneNumber: "",
          role: ""
        }); 
      }
    }, 2000);
  }

 if(successMessage){
    navigate("/login");}
}, [successMessage, errorMessage]);
     return (
    <div className="page-container">
       
        

        {loading && <div className="toast info">Registering user...</div>}
         {successMessage && <div className="toastForm success">{successMessage}</div>}
{errorMessage && <div className="toastForm error">{errorMessage}</div>}
      <div className="form-card">
        <div className="login-logo">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/004/297/596/small/education-logo-open-book-dictionary-textbook-or-notebook-with-sunrice-icon-modern-emblem-idea-concept-design-for-business-libraries-schools-universities-educational-courses-vector.jpg"
            alt="Library Logo"
          />
          </div>
        <h2 className="form-title">Register User</h2>

        <form onSubmit={handleSubmit} className="grid-form">
          
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* <label>Role:</label>
          <input
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            
          /> */}

          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>Phone No:</label>
          <input
            type="text"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
          />

          <button type="submit" className="btn-submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}