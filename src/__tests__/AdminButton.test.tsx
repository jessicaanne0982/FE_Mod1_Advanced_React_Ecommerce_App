import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavBar from '../components/NavBar';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import type { AuthContextType } from '../contexts/AuthContext';
import { Provider } from 'react-redux';
import { store } from '../redux/store'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import firebase from '../firebaseConfig';

// Declares variables to store Firebase auth and db instances
let auth: ReturnType<typeof import('firebase/auth').getAuth>;
let db: ReturnType<typeof import('firebase/firestore').getFirestore>;

// Initialize Firebase services before all tests to ensure they're available for testing
beforeAll(async() => {
  const res = await firebase
  auth = res.auth
  db = res.db
})

// Function to create a new QueryClient instance for each test, ensuring no cached data from previous tests
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, 
      },
    },
  });

// Helper function to render the NavBar Component with a specific user value
// Allows for testing different user states (logged in vs logged out)
const renderNavBarWithUser = (user: AuthContextType['user']) => {
  const queryClient = createTestQueryClient(); // Creates a new QueryClient instance

  // Renders the NavBar wrapped in the necessary context providers
  return render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthContext.Provider value={{ user, setUser: jest.fn(), loading: false }}>
          <MemoryRouter>
            <NavBar />
          </MemoryRouter>
        </AuthContext.Provider>
      </Provider>
    </QueryClientProvider>
  );
};

// Test for verifying visibility of the "Admin" button based on authentication state
describe('Admin Button visibility', () => {
  test('show Admin Button with user is logged in', () => {
    // Mock user object to simulate a user being logged in
    const mockUser = {
        email: 'admin@example.com',
        uid: '123',
        name: 'Admin User',
        address: '123 Admin St',
        phone: '123-456-7890',
        createdAt: new Date(), 
      };
    // Render NavBar with a logged-in user  
    renderNavBarWithUser(mockUser);
    // Assert that the Admin button is visible in the document
    expect(screen.getByRole('button', { name: /admin/i })).toBeInTheDocument();
  });

  test('does NOT show admin button when user is not logged in', () => {
    // Render NavBar with no user (or logged out state)
    renderNavBarWithUser(null);
    // Assert that the Admin button is NOT visible in the document
    expect(screen.queryByRole('button', { name: /admin/i })).not.toBeInTheDocument();
  });
});
