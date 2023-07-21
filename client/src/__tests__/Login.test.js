import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux'; // If you are using Redux
import configureStore from 'redux-mock-store'; // If you are using Redux
import Login from '../components/auth/Login';

// Mock the login action function
const mockLogin = jest.fn();

// Mock the Redux store
const mockStore = configureStore([]);

test('renders the login form correctly', () => {
  // Create a mock Redux store with initial state (isAuthenticated: false, user: null)
  const store = mockStore({
    auth: { isAuthenticated: false, user: null },
  });

  // Render the Login component inside the mock Redux Provider
  const { getByPlaceholderText, getByText } = render(
    <Provider store={store}>
      <Login login={mockLogin} />
    </Provider>
  );

  // Test that the email and password input fields are rendered correctly
  const emailInput = getByPlaceholderText('Email Address');
  const passwordInput = getByPlaceholderText('Password');
  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();

  // Test that the login button is rendered
  const loginButton = getByText('Login');
  expect(loginButton).toBeInTheDocument();
});

test('calls login function when the form is submitted', () => {
  const store = mockStore({
    auth: { isAuthenticated: false, user: null },
  });

  const { getByText, getByPlaceholderText } = render(
    <Provider store={store}>
      <Login login={mockLogin} />
    </Provider>
  );

  // Get the email and password input fields
  const emailInput = getByPlaceholderText('Email Address');
  const passwordInput = getByPlaceholderText('Password');

  // Simulate user input
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  // Get the login button and click it
  const loginButton = getByText('Login');
  fireEvent.click(loginButton);

  // Test that the login function was called with the correct email and password values
  expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
});