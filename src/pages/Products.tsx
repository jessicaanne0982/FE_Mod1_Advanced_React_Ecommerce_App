import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Container, Table, Image } from "react-bootstrap";
import { RootState } from "../redux/store";
import { Product } from "../types/types";
import { addToCart } from "../redux/CartSlice";
import { useSelector, useDispatch } from "react-redux";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Asynchronous function that makes a GET request from the Fake Store API depending on the chosen category and displays those products
// If no category is chosen, all products will display
const fetchProductsFromAPI = async (category: string): Promise<Product[]> => {
    const url = category
        ? `https://fakestoreapi.com/products/category/${category}`
        : 'https://fakestoreapi.com/products';
    
    const response = await axios.get(url);
    return response.data;
};

// Fetches products from Firestore
const fetchProductsFromFirestore = async (): Promise<Product[]> => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const firestoreProducts: Product[] = [];

    // Convert each document into a Product object and push it to an array
    querySnapshot.forEach((doc) => {
        firestoreProducts.push({ id: doc.id, ...doc.data() } as unknown as Product);
    });

    return firestoreProducts;
};

const Products = () => {
    const dispatch = useDispatch();
    // Pull current cart items from the store
    const { items } = useSelector((state: RootState) => state.cart);
    console.log(items) // Debugging tool to see if items were being stored in sessionState
    // Pulls selected category from the store
    const selectedCategory = useSelector((state: RootState) => state.category.selectedCategory);

    // Fetch products from the API with React Query
    const { data: apiProducts, isLoading, error } = useQuery<Product[]>({
        queryKey: ['products', selectedCategory],
        queryFn: () => fetchProductsFromAPI(selectedCategory),
    });

    // Fetch products from Firestore
    const { data: firestoreProducts = [] } = useQuery<Product[]>({
        queryKey: ['firestoreProducts'],
        queryFn: fetchProductsFromFirestore,
    });

    // Filter Firestore products by selectedCategory (if selected)
    const filteredFirestoreProducts = selectedCategory
    ? firestoreProducts.filter((product) => product.category === selectedCategory)
    : firestoreProducts;

    // Merge both product arrays
    const allProducts = [...(apiProducts || []), ...filteredFirestoreProducts];

    // Loading state
    if (isLoading) return <p>Loading...</p>
    // Show error state if API request fails
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
                    {allProducts.map((product) => (
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
                            <td>{product.price}</td>
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