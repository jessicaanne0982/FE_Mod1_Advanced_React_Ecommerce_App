import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import { useDispatch} from "react-redux";
import { setCategory } from "../redux/CategorySlice";
import logo from '../assets/logo.png';
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import firebase from "../firebaseConfig";
import type { Auth } from 'firebase/auth';
import { useState, useEffect } from "react";


// Fetches product categories from the Fake Store API
const fetchCategories = async (): Promise<string[]> => {
    const response = await axios.get('https://fakestoreapi.com/products/categories');
    return response.data;
};

// NavBar Component displayed at the top of the app
const NavBar: React.FC = () => {
    const dispatch = useDispatch(); // Redux dispatcher
    const navigate = useNavigate(); // Navigation handler
    const { user } = useAuth(); // Auth context to get user

    const [authInstance, setAuthInstance] = useState<Auth | null>(null);
    useEffect(() => {
        firebase.then(({ auth }) => {
            setAuthInstance(auth)
        })
    }, [])
    // React query to fetch categories and handle loading, error, and caching
    const { data: categories, isLoading, error } = useQuery<string[]>({
        queryKey: ['categories'], // unique key for caching
        queryFn: fetchCategories // function that fetches the data
    });

    // Logs the user out and redirects to the login page
    const handleLogout = async () => {
        if(!authInstance) return;
        await signOut(authInstance);
        navigate("/login")
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                {/* "Fake Store Brand" logo that links to Home Page */}
                <Navbar.Brand href="/">
                    <img src={logo} width="40" height="40" className="d-inline-block align-top" alt="Fake Store API logo"/> 
                </Navbar.Brand>

                {/* Responsive toggle for viewing on smaller screens */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">

                        {/* Dropdown for selecting category */}
                        <NavDropdown title="Product Category " id="product-categories">
                            {/* Sets the category selection to 'All' by setting it to an empty string */}
                            <NavDropdown.Item 
                                onClick={() => {
                                    dispatch(setCategory(''));
                                    navigate("/");
                                }}
                            >
                                All
                            </NavDropdown.Item>

                            {/* // Show loading or error states when fetching categories */}
                            {isLoading && <NavDropdown.Item disabled>Loading...</NavDropdown.Item>}   
                            { error && <NavDropdown.Item disabled>Error loading categories!</NavDropdown.Item>} 
                            {/* Dynamically render categories from the API */}
                            {categories?.map((cat) => (
                            <NavDropdown.Item
                                key={cat}
                                onClick={() => {
                                    dispatch(setCategory(cat));
                                    navigate("/");
                                }}
                            >
                                {cat}
                            </NavDropdown.Item>
                            ))}     
                        </NavDropdown>

                         {/* Conditional rendering based on user authentication */}
                        {!user ? (
                            <>
                                {/* Shown when users are not logged in */}
                                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
                            </>
                        ) : (
                            <>
                                {/* Shown when user is logged in */}
                                <Nav.Link as={NavLink} to="/profile">User Profile</Nav.Link>
                                <Nav.Link as={NavLink} to="/cart">Shopping Cart</Nav.Link>
                                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                            </>
                        )}
                    </Nav>

                    {/* Admin section shown on the right side, only to logged in users */}
                    {user && (
                        <Nav className="ms-auto">
                            <NavLink to="/admin" className="nav-link">
                                <Button variant="danger">Admin</Button>
                            </NavLink>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
      );
};

export default NavBar;

  