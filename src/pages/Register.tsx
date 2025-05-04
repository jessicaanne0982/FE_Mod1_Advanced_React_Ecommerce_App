import { useState, FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


const Register = () => {
    // Form field states
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Handles form submission to register the user
    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        try {
            // Create a new user with email and password using Firebase Authentication
            const userData = await createUserWithEmailAndPassword(auth, email, password);
            const user = userData.user;

            // Save additional user data to Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: user.email, 
                name,
                address,
                phone,
                createdAt: new Date(),
            });
            alert("Registraion successful! User added to the database.");
            navigate("/profile"); // Redirects to the profile page after successful registration
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        // Centered card layout using Bootstrap
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ minWidth: '300px' }}>
                <h3 className="text-center mb-4">Register for New Account</h3>
                {/* Registration Form */}
                <form onSubmit={handleRegister}>
                <div className="mb-3">
                        <input
                        type="text"
                        className="form-control"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <input
                        type="text"
                        className="form-control"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <input
                        type="text"
                        className="form-control"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <input
                        type="text"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <input  
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mb-2">Register</button>
                    {error && <p className="text-danger text-center">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Register;