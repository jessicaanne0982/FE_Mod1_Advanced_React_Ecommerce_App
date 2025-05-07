import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../pages/Login'
import { MemoryRouter } from 'react-router-dom';

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();

// Replace the actual useNavigate with our mock
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('Register New User Button', () => {
    test('navigates to /register when clicked', () => {
        // Render the Login component wrapped in routing context
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        // Get the "Register New User" button
        const registerButton = screen.getByRole('button', { name: /register new user/i });

        // Click the button
        fireEvent.click(registerButton);

        // Expect navigate to have been called with '/register'
        expect(mockNavigate).toHaveBeenCalledWith('/register');
    });
});
