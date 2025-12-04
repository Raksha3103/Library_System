import { Route, Routes } from 'react-router-dom';
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import AuthorPage from "./pages/AuthorPage";
import BookForm from "./pages/BookForm";
import RegisterForm from './pages/RegisterForm';
import LoginForm from './pages/LoginForm';
import BorrowHistory from "./pages/BorrowHistory";
import AuthorForm from "./pages/AuthorForm";
import HomePage from "./pages/HomePage";
import homePage from "./homePage.css";
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRequestsPage from "./pages/AdminRequestPage";
import AddRequestPage from "./pages/AddRequestPage";
import AdminBorrowHistory from "./pages/AdminBorrowHistory";

//npx json-server --watch db.json --port 5000
function App() {
  const role = localStorage.getItem("role");
 
  return (
    
   <div className="App">
    
      <Routes>
        <Route path="/" element={<HomePage />} />
<Route
  path="/books"
  element={
    <ProtectedRoute>
      <Books />
    </ProtectedRoute>
  }
/>
 {role === "Admin" && (
          <Route path="/admin-borrow-history" element={<AdminBorrowHistory />} />
        )}
        <Route path="/books/:id" element={<BookDetails />} />
      <Route path="/books/add" element={<BookForm />} />
       <Route path="/authors" element={<ProtectedRoute><AuthorPage /></ProtectedRoute>} />

<Route path="/books/edit/:id" element={<BookForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
<Route path="/borrow/history" element={<BorrowHistory />} />
 <Route path="/authors/add" element={<AuthorForm />} />
        <Route path="/authors/edit/:id" element={<AuthorForm />} />
        <Route
    path="/requests"
    element={
      <ProtectedRoute>
        <AddRequestPage />
      </ProtectedRoute>
    }
  />

 
  <Route
    path="/admin/requests"
    element={
      <ProtectedRoute>
        <AdminRequestsPage />
      </ProtectedRoute>
    }
  />
        
    </Routes>
    </div>
  );
}

export default App;
