import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { useDispatch} from "react-redux";
import { setCategory } from "../redux/CategorySlice";
import logo from '../assets/logo.png';
import { NavLink } from "react-router-dom";

// Fetches product categories from the Fake Store api
const fetchCategories = async (): Promise<string[]> => {
    const response = await axios.get('https://fakestoreapi.com/products/categories');
    return response.data;
};

// Fetches the categories using React Query
const NavBar: React.FC = () => {
    const dispatch = useDispatch();
    const { data: categories, isLoading, error } = useQuery<string[]>({
        queryKey: ['categories'], // unique key for caching
        queryFn: fetchCategories // function that fetches the data
    });

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                {/* "Fake Store Brand" logo that links to Home Page */}
                <Navbar.Brand href="/">
                    <img
                    src={logo}
                    width="40"
                    height="40"
                    className="d-inline-block align-top"
                    alt="Fake Store API logo"
                    /> 
                </Navbar.Brand>
                {/* Responsive toggle for viewing on smaller screens */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                    {/* Dropdown for selecting category */}
                    <NavDropdown title="Product Category " id="product-categories">
                        {/* Sets the category selection to 'All' by setting it to an empty string */}
                        <NavDropdown.Item onClick={() => dispatch(setCategory(''))}>All</NavDropdown.Item>
                            {/* // Show loading or error states when fetching categories */}
                            {isLoading && <NavDropdown.Item disabled>Loading...</NavDropdown.Item>}   
                            { error && <NavDropdown.Item disabled>Error loading categories!</NavDropdown.Item>} 
                            {/* Dynamically render categories from the API */}
                            { categories?.map((cat) => (
                                <NavDropdown.Item key={cat} onClick={() => dispatch(setCategory(cat))}>
                                    {cat}
                                </NavDropdown.Item>
                            ))}               
                    </NavDropdown>
                    {/* Link to the shopping cart page */}
                    <Nav.Link as={NavLink} to="/cart">Shopping Cart</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
      );
};

export default NavBar;

  