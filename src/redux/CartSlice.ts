import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Product } from "../types/types";
import { RootState } from "./store";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import firebase from "../firebaseConfig";

// Defines the starting state for the cart slice
// The cart contains an array of Product objects
interface CartState {
    items: Product[],
}

// Initial cart begins as an empty array
const initialState: CartState = {
    items: [],
};

// Creates the cart slice.  
const cartSlice = createSlice({
    name: 'shopping-cart', // name of slice
    initialState,
    reducers: {
        // Adds products to the shopping cart
        // If a product is already in the cart, it updates the quantity in the cart
        addToCart: (state, action: PayloadAction<Product>) => {
            const itemToAdd = action.payload;
            const existingItem = state.items.find(item => item.id === itemToAdd.id);
            const quantityToAdd = itemToAdd.quantity?? 1; // if quantity is not set, the default is 1
            if (!existingItem) {
                // if an item doesn't exist in the cart, adds it 
                state.items.push({ ...itemToAdd, quantity: quantityToAdd });
                return
            }
            // if an item already exists in the cart, just increase the quantity
            existingItem.quantity = (existingItem.quantity?? 0) + quantityToAdd 
        },

        // Removes products from the shopping cart based on its ID
        deleteFromCart: (state, action: PayloadAction<Product>) => {
            const itemToDelete = action.payload.id;
            state.items = state.items.filter(item => item.id !== itemToDelete);
        },

        // Updates the quantity of a specific item in the cart
        updateCartItem: (state, action: PayloadAction<{ id: string | number; quantity: number }>) => {
            const { id, quantity } = action.payload;
            const existingItem = state.items.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity = quantity;
            }
        },

        // Clears the entire cart
        clearCart : (state) => {
            state.items = [];
        },
    },
});

export const submitCart = createAsyncThunk (
    'cart/submitCart',
    async (_, { getState, dispatch }) => {
        const { auth, db } = await firebase;
        const state = getState() as RootState;
        const items = state.cart.items; // gets the current cart items from Redux
        const user = auth.currentUser; // gets the current Firebase user that's logged in

        if (!user) { // checks to make sure user is logged in
            alert("User not logged in!");
            return;
        }

        if (items.length === 0) {
            alert("Cart is empty!");
            return;
        }

        // calculates the total price of the cart
        const total = items.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0);

        // creates the order object
        const order = {
            userId: user.uid,
            items: items.map(item => ({
                id: item.id,
                name: item.title,
                quantity: item.quantity,
                price: item.price,
            })),
            total,
            createdAt: serverTimestamp(),
        };

        try {
            await addDoc(collection(db, "orders"), order); // saves the order to Firestore
            dispatch(clearCart()); // clears the cart
            alert("Thank you for your order!");
        } catch (error) {
            console.error("Error submitting order: ", error);
            alert("Failed to submit order");
        }
    }
);

// exports reducer actions to be used in components
export const { addToCart, deleteFromCart, updateCartItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;


