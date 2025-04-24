import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Products from "./components/Products";
import ShoppingCart from "./components/ShoppingCart";
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  
  return (
    <>
      {/* The navbar is visible on all pages */}
      <NavBar />
      {/* Defines the routes for the app */}
      <Routes>
        {/* The Home route navigates to the Products page */}
        <Route path='/' element={<Products />} /> 

        {/* The Cart route navigates to the ShoppingCart component */}
        <Route path="/cart" element={<ShoppingCart />} /> 
      </Routes>
    </>
  );
};

export default App;
