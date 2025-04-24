import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../types/types";

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
        updateCartItem: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
            const { id, quantity } = action.payload;
            const existingItem = state.items.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity = quantity;
            }
        },

        // Clears the entire cart
        clearCart : (state) => {
            state.items = [];
            alert("Your cart will be cleared!")
        },

        // Simulates a user submitting the cart and then clears it
        submitCart : (state) => {
            state.items = [];
            alert("Thank you for your order! An order confirmation will be sent shortly.")
        }
    },
});

// exports reducer actions to be used in components
export const { addToCart, deleteFromCart, updateCartItem, clearCart, submitCart } = cartSlice.actions;
export default cartSlice.reducer;


