// Only displays Firestore Products and allows edits and deletion
import React, { useEffect} from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import type { Firestore } from 'firebase/firestore';
import firebase from "../firebaseConfig";
import { Table, Button, Container, Modal, Form } from "react-bootstrap";
import { Product } from "../types/types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";



const AdminProducts = () => {
    const navigate = useNavigate();

    const [dbInstance, setDbInstance] = useState<Firestore | null>(null);
    useEffect(() => {
        firebase.then(({ db }) => {
            setDbInstance(db)
        })
    }, [])
    // Only fetches products from Firestore (not Fake Store API)
    const fetchProductsFromFirestore = async (): Promise<Product[]> => {
        if(!dbInstance) return [];
    const querySnapshot = await getDocs(collection(dbInstance, "products"));
    return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data()
    } as unknown as Product)); // Cast to match the Product type
};
    // Uses React Query to manage fetching and caching of Firestore products
    const { data: products = [], refetch } = useQuery({
        queryKey: ['adminFirestoreProducts'],
        queryFn: fetchProductsFromFirestore,
    });
    

    const [showModal, setShowModal] = useState(false); // Controls visibility of edit modal
    const [ currentProduct, setCurrentProduct ] = useState<Product | null>(null); // Currently selected product to edit

    // Deletes a product by its Firestore ID
    const handleDelete = async (id: string) => {
        if (!dbInstance) return;
        await deleteDoc(doc(dbInstance, "products", id));
        refetch();
    };

    // Opens the modal and sets the current product for editing
    const handleEditClick = (product: Product) => {
        setCurrentProduct(product);
        setShowModal(true);
    }

    // Handles changes to form inputs inside the modal
    const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (!currentProduct) return;
        const { name, value } = e.target;
        setCurrentProduct({
            ...currentProduct,
            [name]: name === "price" || name === "quantity" ? Number(value) : value,
        });
    };

    // Updates the Firestore document with the edited product data
    const handleUpdate = async () => {
        if (!currentProduct) return;
        try {
            if (!dbInstance) return;
            await updateDoc(doc(dbInstance, "products", String(currentProduct.id)), {
                title: currentProduct.title,
                price: currentProduct.price,
                category: currentProduct.category,
                description: currentProduct.description,
                quantity: currentProduct.quantity,
            });
            setShowModal(false); // Closes modal when complete
            refetch(); // Refreshes product list
        } catch (error) {
            console.error("Error updating product: ", error);
            alert("Product update failed")
        }
    };

    return (
        // Firestore Products are displayed in a table.  A modal pops up to allow the user to edit products.
        <Container className="mt-4">
            <h2>Admin - Firestore Products</h2>
            <Button variant="success" className="mb-3" onClick={() => navigate("/add-product")}>Add New Product</Button>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.title}</td>
                            <td>{product.price}</td>
                            <td>{product.category}</td>
                            <td>
                                <Button variant="warning" className="me-2" onClick={() => handleEditClick(product)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDelete(String(product.id))}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Edit Product Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentProduct && (
                        <Form>
                            <Form.Group className="mb-2">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    name="title"
                                    value={currentProduct.title}
                                    onChange={handleModalChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={currentProduct.price}
                                    onChange={handleModalChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>Category</Form.Label>
                                <Form.Select
                                    name="category"
                                    value={currentProduct.category}
                                    onChange={handleModalChange}
                                >
                                    <option value="electronics">Electronics</option>
                                    <option value="jewelery">Jewelery</option>
                                    <option value="men's clothing">Men's Clothing</option>
                                    <option value="women's clothing">Women's Clothing</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={currentProduct.description}
                                    onChange={handleModalChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="quantity"
                                    value={currentProduct.quantity}
                                    onChange={handleModalChange}
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleUpdate}>Update Product</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminProducts;
