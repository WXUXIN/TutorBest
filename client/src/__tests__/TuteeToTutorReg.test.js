import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import TutorReg from "../components/profiles/dashboard/TutorReg";

// Mock the Redux store
const mockStore = configureStore([]);

// Mock the setAlert and tutorReg actions
const mockSetAlert = jest.fn();
const mockTutorReg = jest.fn();

describe("Tutor Registration Page (When a Tutee Signs Up as a Tutor)", () => {
  beforeEach(() => {
    // Clear any previous mock function calls
    mockSetAlert.mockClear();
    mockTutorReg.mockClear();
  });

  it("should sign up as a tutor successfully when a tutee selects 'Tutor' and fills in the tutor registration form", async () => {
    // Mock the user data for an authenticated tutee
    const user = {
      isAuthenticated: true,
      user: {
        isTutor: false, // User is a tutee
      },
    };

    // Render the component with the mocked store and user data
    render(
      <Provider store={mockStore(user)}>
        <TutorReg setAlert={mockSetAlert} tutorReg={mockTutorReg} />
      </Provider>
    );

    // Select 'Tutor' from the dropdown
    fireEvent.change(screen.getByLabelText("I am a"), {
      target: { value: "tutor" },
    });

    // Ensure the user is directed to the tutor registration page
    expect(screen.queryByText("Please register as a tutor:")).toBeInTheDocument();

    // Fill in the tutor registration form
    // (Assuming valid data for simplicity)
    fireEvent.change(screen.getByLabelText("Select your subject(s):"), {
      target: { value: "Primary School" },
    });

    fireEvent.change(screen.getByLabelText("Select Level of Study"), {
      target: { value: "Primary 1" },
    });

    fireEvent.change(screen.getByLabelText("Select subject"), {
      target: { value: "English" },
    });

    fireEvent.change(screen.getByPlaceholderText("Price"), {
      target: { value: "20" },
    });

    fireEvent.change(screen.getByLabelText("Select your highest qualification"), {
      target: { value: "Graduate" },
    });

    fireEvent.change(screen.getByLabelText("Description:"), {
      target: { value: "Hi! I am a new tutor" },
    });

    fireEvent.click(screen.getByText("Join us as a Tutor!"));

    // Ensure the tutorReg function is called with the correct data
    expect(mockTutorReg).toHaveBeenCalledWith({
      userID: user.user._id,
      isTutor: true,
      subjectList: [
        {
          subject: "English",
          level: "Primary 1",
          price: "20",
        },
      ],
      highestQualification: "Graduate",
      description: "Hi! I am a new tutor",
    });

  });
});
