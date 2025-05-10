import React from "react";
import { Container, Table, Image, Button } from "react-bootstrap";
import { RootState, AppDispatch } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { deleteFromCart, updateCartItem, clearCart, submitCart  } from "../redux/CartSlice";
import { useNavigate } from "react-router-dom";

const ShoppingCart = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // Access cart items from Redux store
    const { items } = useSelector((state: RootState) => state.cart);

    // Clears all cart items from the cart
    const handleCancelOrder = () => {
        dispatch(clearCart());
        alert("Your cart will be cleared!");
    };

    // Submits the cart 
    const handleSubmitOrder = async () => {
        await dispatch(submitCart());
        navigate("/"); // navigate back to home page
    };


    return ( 
        <Container className="mt-4">
            <h2>Cart</h2>
            {/* Bootstrap table displays all the items in the cart */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Quantity</th>
                        <th>Price ($)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items?.map((product) => (
                        <tr key={product.id}>
                            <td>
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    thumbnail
                                    style={{ maxWidth: '80px' }}
                                />
                            </td>
                            <td style={{ maxWidth: '300px' }}>{product.title}</td>

                            {/* Displays product quantity */}
                            <td>{product.quantity}</td>

                            {/* Displays the total price based on the quantity entered */}
                            <td>{(product.price * (product.quantity ?? 1)).toFixed(2)}</td>

                            {/* Action Buttons to increase, decrease, or remove items */}
                            <td>
                                <Button variant="primary" className="me-1" 
                                    onClick={() => dispatch(updateCartItem({ id: product.id, quantity: (product.quantity ?? 1) + 1 }))}>
                                        +
                                </Button>
                                <Button 
                                    variant="warning" 
                                    className="me-1" 
                                    disabled={(product.quantity ?? 1) <= 1} // disable if quantity is 1 or less
                                    onClick={() => dispatch(updateCartItem({ id: product.id, quantity: (product.quantity ?? 1) - 1 }))
                                    }
                                >
                                    -
                                </Button>
                                <Button variant="danger" onClick={() => dispatch(deleteFromCart(product))}>Remove</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {/* Cart Summary that displays the number of items in the cart as well as total cost */}
            <h6>Number of Items:  {items.reduce((total, item) => total + item.quantity, 0)}</h6>
            <h5>Total: $
                {items.reduce((total, item) => total + item.price * (item.quantity ?? 1), 0).toFixed(2)}
            </h5>
            {/* Cart action buttons */}
            <Button variant="secondary" className="me-3" onClick={handleCancelOrder} >Cancel Order</Button>

            <Button variant="success" className="me-3" onClick={handleSubmitOrder}>Submit Order</Button>
        </Container>
    );
};

export default ShoppingCart;