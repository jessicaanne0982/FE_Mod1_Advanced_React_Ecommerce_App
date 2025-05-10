
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShoppingCart from '../pages/ShoppingCart';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../redux/CartSlice';
import type { Product } from '../types/types';
import { BrowserRouter } from 'react-router-dom';

// Mock Product data to simulate cart items in tests
const mockProduct: Product = {
    id: 1,
  title: 'Test Product',
  image: 'https://via.placeholder.com/150',
  price: 10,
  quantity: 2, 
  description: 'Test product description',
  category: 'Test category',
  rating: {
    rate: 4.5,
    count: 100,
  },
};

// Function to render the ShoppingCart component with a preloaded Redux store state
const renderWithStore = (preloadedItems: Product[]) => {
  // Configure a Redux store with preloaded cart state
  const store = configureStore({
    reducer: {
      cart: cartReducer, // Responsible for handling cart actions  
    },
    preloadedState: {
      cart: {
          items: preloadedItems, // Preload the cart with mock items
      },
    },
  });
  // Return the render function wrapped with necessary providers
  return render (
      <Provider store={store}>
          <BrowserRouter>
              <ShoppingCart />
          </BrowserRouter>
      </Provider>
  );
};

describe('Shopping Cart Component', () => {
  // Test to check if an item is displayed in the shopping cart when added
  test('displays item when added to cart', () => {
    renderWithStore([mockProduct]); // Render with the mock product in the cart

    // Assert that the product title is displayed
    expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
    // Assert that the correct quantity (2) is displayed for the product
    expect(screen.getByText('2')).toBeInTheDocument();
    // Assert that the total price is calculated correctly based on quantity and price
    expect(screen.getByText((_, node) =>
          node?.textContent?.replace(/\s/g, '') === 'Total:$20.00')).toBeInTheDocument();

  });
  // Test to ensure the correct total and item count is displayed in the cart
  test('shows correct total and item count', () => {
    renderWithStore([mockProduct]);

    // Assert that the total number of items (2) is shown
    expect(screen.getByText(/Number of Items: 2/i)).toBeInTheDocument();
    // Assert that the correct total price ($20.00) is displayed
    expect(screen.getByText(/Total: \$20.00/i)).toBeInTheDocument();
  });
});

