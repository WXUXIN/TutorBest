// Login.test.js

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; // You may need to install this package

import Login from './Login';

// Create a mock store for testing
const mockStore = configureStore([]);

describe('Login Component', () => {
  it('should render the login form', () => {
    // Create a mock store with any initial state needed
    const store = mockStore({
      auth: {
        isAuthenticated: false,
        user: null,
      },
    });

    // Render the Login component with the mock store as a Provider
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    // Check if the login form elements are rendered correctly
    expect(getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getByText('Login')).toBeInTheDocument();
  });

  // You can add more test cases to cover other scenarios like form submissions, error handling, etc.
});