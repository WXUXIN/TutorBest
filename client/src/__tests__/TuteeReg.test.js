import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Register from "../components/auth/Register";

// Mock the Redux store
const mockStore = configureStore([]);
const store = mockStore({
  auth: {
    isAuthenticated: false,
    user: null,
  },
});

describe("Register Component", () => {
  it("should allow users to sign up as a tutee", () => {
    // Render the component with the mocked Redux store
    render(
      <Provider store={store}>
        <Register />
      </Provider>
    );

    // Fill in the registration form fields
    const usernameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email Address");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");

    fireEvent.change(usernameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "tutorbest.test123@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });

    // Find the submit button and click it to submit the form
    const submitButton = screen.getByText("Register");
    fireEvent.click(submitButton);
  });
});
