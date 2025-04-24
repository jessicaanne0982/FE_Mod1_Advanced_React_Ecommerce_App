import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Container, Table, Image } from "react-bootstrap";
import { RootState } from "../redux/store";
import { Product } from "../types/types";
import { addToCart } from "../redux/CartSlice";
import { useSelector, useDispatch } from "react-redux";

// Asynchronous function that makes a GET request from the API depending on the chosen category and displays those products
// If no category is chosen, all products will display
const fetchProducts = async (category: string): Promise<Product[]> => {
    const url = category
        ? `https://fakestoreapi.com/products/category/${category}`
        : 'https://fakestoreapi.com/products';
    
    const response = await axios.get(url);
    return response.data;
};

const Products = () => {
    const dispatch = useDispatch();
    // Pull current cart items from the store
    const { items } = useSelector((state: RootState) => state.cart);
    console.log(items) // Debugging tool to see if items were being stored in sessionState
    // Pulls selected category from the store
    const selectedCategory = useSelector((state: RootState) => state.category.selectedCategory);

    // Use 'useQuery' to fetch products and re-fetch when selectedCategory changes
    const { data, isLoading, error } = useQuery<Product[]>({
        queryKey: ['products', selectedCategory],
        queryFn: () => fetchProducts(selectedCategory),
    });

    // Loading state
    if (isLoading) return <p>Loading...</p>
    // Error state
    if (error) return <p>Error loading products!</p>;

    return ( // Display the products in a table format
        <Container className="mt-4">
            <h2>Products {selectedCategory ? `- ${selectedCategory}` : "- All"}</h2>
            {/* Display the product list in a Bootstrap table */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Price ($)</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Rate</th>
                        <th>Add to Cart</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((product) => (
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
                            <td>{product.price.toFixed(2)}</td>
                            <td>{product.category}</td>
                            <td style={{ maxWidth: '300px' }}>{product.description}</td>
                            <td>{product.rating?.rate ?? 'N/A'} ⭐</td>
                            <td><button onClick={() => dispatch(addToCart(product))}>Add to Cart</button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default Products;