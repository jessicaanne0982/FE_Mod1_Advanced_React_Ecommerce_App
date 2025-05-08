
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShoppingCart from '../pages/ShoppingCart';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../redux/CartSlice';
import type { Product } from '../types/types';
import { BrowserRouter } from 'react-router-dom';

// Mock Product for shopping cart
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

// Create a store with preloaded state
const renderWithStore = (preloadedItems: Product[]) => {
    const store = configureStore({
        reducer: {
            cart: cartReducer,
        },
        preloadedState: {
            cart: {
                items: preloadedItems,
            },
        },
    });

    return render (
        <Provider store={store}>
            <BrowserRouter>
                <ShoppingCart />
            </BrowserRouter>
        </Provider>
    );
};

describe('Shopping Cart Component', () => {
  test('displays item when added to cart', () => {
    renderWithStore([mockProduct]);

    expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText((_, node) =>
          node?.textContent?.replace(/\s/g, '') === 'Total:$20.00')).toBeInTheDocument();

  });

  test('shows correct total and item count', () => {
    renderWithStore([mockProduct]);

    expect(screen.getByText(/Number of Items: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Total: \$20.00/i)).toBeInTheDocument();
  });
});

