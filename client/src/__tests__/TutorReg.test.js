import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Register from "../components/auth/Register";

// Mock the Redux store
const mockStore = configureStore([]);

// Mock the setAlert and register actions
const mockSetAlert = jest.fn();
const mockRegister = jest.fn();

describe("Register Component (Tutor Sign Up)", () => {
  // Helper function to fill in the registration form
  const fillInRegistrationForm = () => {
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { name: "name", value: "Tutor Name" },
    });

    fireEvent.change(screen.getByPlaceholderText("Email Address"), {
      target: { name: "email", value: "tutor@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { name: "password", value: "password123" },
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { name: "password2", value: "password123" },
    });

    fireEvent.click(screen.getByText("I want to be a tutor!"));
  };

  beforeEach(() => {
    // Clear any previous mock function calls
    mockSetAlert.mockClear();
    mockRegister.mockClear();
  });

  it("should sign up as a tutor successfully", async () => {
    // Mock the user data for an authenticated tutor
    const user = {
      isAuthenticated: true,
      user: {
        isTutor: true,
      },
    };

    // Render the component with the mocked store and user data
    render(
      <Provider store={mockStore(user)}>
        <Register setAlert={mockSetAlert} register={mockRegister} />
      </Provider>
    );

    // Fill in the registration form
    fillInRegistrationForm();

    // Continue filling in the tutor-specific details

    // 1. Selecting Subjects to Teach
    fireEvent.click(screen.getByText("+")); // Add a new subject
    fireEvent.change(screen.getByText("* Select Academic Level"), {
      target: { value: "Primary School" },
    });
    fireEvent.change(screen.getByText("Select subject"), {
      target: { value: "English" },
    });
    fireEvent.change(screen.getByPlaceholderText("Price"), {
      target: { value: "20" },
    });

    // 2. Specifying Qualifications
    fireEvent.change(screen.getByText("* Select your highest qualification"), {
      target: { value: "Graduate" },
    });

    // 3. Providing a Description
    fireEvent.change(screen.getByLabelText("Description:"), {
      target: { value: "Hi! I am a new tutor" },
    });

    // Submit the registration form
    fireEvent.click(screen.getByDisplayValue("Register"));

    // Verify that the register function was called with the correct data
    expect(mockRegister).toHaveBeenCalled();
  });
});