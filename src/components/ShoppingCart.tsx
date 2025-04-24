import { Container, Table, Image, Button } from "react-bootstrap";
import { RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { deleteFromCart, updateCartItem, clearCart, submitCart  } from "../redux/CartSlice";

const ShoppingCart = () => {
    const dispatch = useDispatch();
    // Get current items in the cart from state
    const { items } = useSelector((state: RootState) => state.cart);
    return ( // Display the shopping cart in a table format
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
                                <Button variant="warning" className="me-1" 
                                    onClick={() => dispatch(updateCartItem({ id: product.id, quantity: (product.quantity ?? 1) - 1 }))}>
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
            {/* Clicking this button clear the cart */}
            <Button variant="secondary" className="me-3" onClick={() => dispatch(clearCart())} >Cancel Order</Button>
            {/* This button mimics submitting an order by giving an alert and clearing the cart */}
            <Button variant="success" className="me-3" onClick={() => dispatch(submitCart())}>Submit Order</Button>
        </Container>
    );
};

export default ShoppingCart;