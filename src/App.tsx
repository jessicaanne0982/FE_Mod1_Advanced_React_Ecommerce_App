import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Products from "./pages/Products";
import ShoppingCart from "./pages/ShoppingCart";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import AdminProducts from "./pages/AdminProducts";
import AddFirestoreProduct from "./components/AddFirestoreProduct";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectedRoute from "./components/ProtectRoute";

function App() {
  return (
    <>
      {/* Global nav bar rendered on all pages */}
      <NavBar />
      
      {/* Application Routes */}
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Products />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - only displayed when a user is logged in */}
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><ShoppingCart /></ProtectedRoute>} /> 
        <Route path="/admin" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
        <Route path="/add-product" element={<ProtectedRoute><AddFirestoreProduct /></ProtectedRoute>} />
      </Routes>
    </>

  );
};

export default App;
