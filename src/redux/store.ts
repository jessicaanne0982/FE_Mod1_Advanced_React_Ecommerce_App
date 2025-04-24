import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from './CategorySlice';
import cartReducer from './CartSlice';

// loads the cart from sessionStorage if it exists
const loadCartFromSession = () => {
    try {
        const stored = sessionStorage.getItem('cart');
        return stored? JSON.parse(stored): undefined
    } catch (error) {
        return error
    }
};

// Creates the Redux store for managing the application state
export const store = configureStore({
    reducer: {
        category: categoryReducer, // categoryReducer will handle updates related to the selected product category
        cart: cartReducer,  // cartReducer handles updates to the shopping cart 
    },
    // Preloads the cart state from sessionStorage if it is available
    preloadedState: {
        cart: loadCartFromSession(),
    }
});

// Handles store updates and saves the shopping cart to sessionStorage each time a change is made
store.subscribe(() => {
    try {
        const state = store.getState()
        sessionStorage.setItem('cart', JSON.stringify(state.cart)) 
    } catch (error) {
        console.error(error)
    }
})

// Type definitions for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;