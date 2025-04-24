import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Defines the structure of the state for the category slice.  
// Tracks the currently selected category
interface CategoryState {
    selectedCategory: string;
}

// Defines the starting state for the category slice... it is initialized to an empty string to start
const initialState: CategoryState = {
    selectedCategory: '',
};

// Creates the slice for the category-related state
const categorySlice = createSlice({
    name: 'category', // name of the slice
    initialState,
    reducers: {
        // The reducer function updates the state of the selected category
        setCategory: (state, action: PayloadAction<string>) => {
            state.selectedCategory = action.payload;
        },
    },
});

export const { setCategory } = categorySlice.actions; // export the reducer so components can dispatch it
export default categorySlice.reducer; // export the reducer to be included in the store