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

let auth: ReturnType<typeof import('firebase/auth').getAuth>;
let db: ReturnType<typeof import('firebase/firestore').getFirestore>;

beforeAll(async() => {
  const res = await firebase
  auth = res.auth
  db = res.db
})

// Create a new QueryClient instance for each test run to avoid cache issues
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, 
      },
    },
  });

// Helper function to render the NavBar Component with a specific user value
const renderNavBarWithUser = (user: AuthContextType['user']) => {

  const queryClient = createTestQueryClient();

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

describe('Admin Button visibility', () => {
  test('show Admin Button with user is logged in', () => {
    const mockUser = {
        email: 'admin@example.com',
        uid: '123',
        name: 'Admin User',
        address: '123 Admin St',
        phone: '123-456-7890',
        createdAt: new Date(), 
      };
    renderNavBarWithUser(mockUser);
    expect(screen.getByRole('button', { name: /admin/i })).toBeInTheDocument();
  });

  test('does NOT show admin button when user is not logged in', () => {
    renderNavBarWithUser(null);
    expect(screen.queryByRole('button', { name: /admin/i })).not.toBeInTheDocument();
  });
});
