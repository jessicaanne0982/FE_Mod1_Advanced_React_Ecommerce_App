import React, { FormEvent, useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import firebase from "../firebaseConfig";
import type { Auth } from 'firebase/auth';

const Login = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [authInstance, setAuthInstance] = useState<Auth | null>(null);  // Loads and stores the Firebase Auth instance on mount
    const [hasNavigated, setHasNavigated] = useState(false); // tracks navigation
    const navigate = useNavigate(); // used to redirect users after login
    const location = useLocation();

    
    // Load Firebase Auth instance
    useEffect(() => {
        firebase.then(({ auth }) => {
            setAuthInstance(auth)
        })
    }, []);

    // Prevents infinite redirects by checking the current path (Error I found after deploying)
    useEffect(() => {
        if (!authInstance) return;

        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
            if (user && location.pathname !== "/profile" && !hasNavigated) {
                setHasNavigated(true); // Prevent loop
                navigate("/profile");
            }
        });

        return () => unsubscribe(); // clean up the listener
    }, [authInstance, location.pathname, navigate, hasNavigated]);

    // Handles login form submission
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault(); // Prevents the page from reloading
        try {
            // Attempt login using Firebase Authentication
            if (!authInstance) return;

            await signInWithEmailAndPassword(authInstance, email, password);
            setHasNavigated(true); // Mark that we've already navigated      
            navigate("/profile");  // Redirects to the user profile
        } catch (err) {
            // If login fails, show error message
            setError((err as Error).message);
        }
    };

    return (
        // A card holds the login form and is centered on the page
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ minWidth: '300px' }}>
                <h3 className="text-center mb-4">Login</h3>
                {/* Login Form */}
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-2">Login</button>
                    {/* Display error if login fails */}
                    {error && <p className="text-danger text-center">{error}</p>}

                    {/* Button will redirect user to the registration page */}
                    <button 
                        type="button" 
                        className="btn btn-secondary w-100 mb-2"
                        onClick={() => navigate('/register')}>
                            Register New User
                    </button>
                </form>
            </div>
        </div>

    );
};

export default Login;
