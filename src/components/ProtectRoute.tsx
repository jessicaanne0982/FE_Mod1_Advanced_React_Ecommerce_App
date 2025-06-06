import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ReactNode } from "react";

// Component that protects routes from unauthenticated access
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();
  
    // Spinner shows while auth state is determined
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    // If user is authenticated, render the child components
    // If not, redirect to the login page
    return user ? <>{children}</> : <Navigate to="/login" replace />;
  };
  
  export default ProtectedRoute;