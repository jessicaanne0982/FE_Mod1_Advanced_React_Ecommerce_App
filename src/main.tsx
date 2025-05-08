import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Create a new React Query client instance
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Provides React Query for caching, fetching, and so on */}
    <QueryClientProvider client={queryClient}>
        {/* Provider gives access to the global store across the app */}
        <Provider store={store}>
          <BrowserRouter> {/* Enables routing  */}
            <AuthProvider>
              <App /> {/* main application component  */}
              <ReactQueryDevtools initialIsOpen={false} /> {/* Allows the use of React Query Devtools  */}
            </AuthProvider>
          </BrowserRouter>
        </Provider>
    </QueryClientProvider>
  </StrictMode>
)
