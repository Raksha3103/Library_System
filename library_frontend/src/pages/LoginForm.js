// src/components/LoginForm.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../slices/loginSlice";
import { Link } from "react-router-dom";

export default function LoginForm({ initialData }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loggedInUser } = useSelector((state) => state.login);

  useEffect(() => {
    if (error) {
      setForm({ email: "", password: "" });
      const timer = setTimeout(() => {
        dispatch({ type: "login/clearLoginError" });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (loggedInUser) {
      navigate("/");
    }
  }, [loggedInUser, navigate]);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(LoginUser(form));
  };

  return (
    <div className="login-container">
      {/* Background logo overlay */}
      <div className="login-background"></div>

      <div className="login-card">
        <div className="login-logo">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/004/297/596/small/education-logo-open-book-dictionary-textbook-or-notebook-with-sunrice-icon-modern-emblem-idea-concept-design-for-business-libraries-schools-universities-educational-courses-vector.jpg"
            alt="Library Logo"
          />
        </div>

        <h2>Login Page</h2>

        {error && <p className="msg-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input 
             id="email"
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <input 
             id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit">Login</button>
          <p className="register-text">
            New user? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
