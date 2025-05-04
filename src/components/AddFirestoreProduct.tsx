// Allows users to add new products to the store
import React, { useState} from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { FirestoreProduct } from "../types/types";
import { Form, Button, Container, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// initial state excludes id, rating, and image from user entered products
const initialState: Omit<FirestoreProduct, 'id' | 'rating' | 'image'> = {
    title: "",
    price: 0,
    description: "",
    category: "",
    quantity: 1,
};

const AddFirestoreProduct = () => {
    const [data, setData] = useState(initialState);
    const navigate = useNavigate();

    // Handles input changes for text, number, and textarea fields
    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            // converts numeric values to Number type
            [name]: name === "price" || name === "quantity" ? Number(value) : value,
        }));
    };

    // Handles input changes for select field (dropdown box)
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    // Handles form submission for adding a new product to Firestore
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // prevents default submission behavior
        try {
            // Add new product to the "products" collection
            await addDoc(collection(db, 'products'), data);
            alert('New product added!');
            setData(initialState); // reset form
            navigate('/admin'); // redirect to Admin page
        } catch (error) {
            console.error('Error adding product: ', error);
            alert("Failed to add product!")
        }
    };

    // Handles cancel button click 
    const handleCancel = () => {
        setData(initialState); // resets the form
        navigate('/admin'); //navigate back to Admin page
    }

    return (
        // form for user to add new product
        <Container className="mt-4">
            <h2>Add New Firestore Product</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control 
                        name="title" 
                        value={data.title} 
                        onChange={handleChange} 
                        required 
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control 
                            type="number"
                            step="0.01"
                            name="price"
                            value={data.price}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select 
                        name="category" 
                        value={data.category} 
                        onChange={handleSelectChange} 
                        required
                    >
                        <option value="">Select a category</option>
                        <option value="electronics">Electronics</option>
                        <option value="jewelery">Jewelery</option>
                        <option value="men's clothing">Men's Clothing</option>
                        <option value="women's clothing">Women's Clothing</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={data.description}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                        type="number"
                        name="quantity"
                        value={data.quantity}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button type="submit" className="me-2">Add Product</Button>
                <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            </Form>
        </Container>
    );
};

export default AddFirestoreProduct;