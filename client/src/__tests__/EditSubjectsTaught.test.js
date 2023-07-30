import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import TutorSettings from "../components/dashboard/TutorSettings";

// Mock Redux store
const mockStore = configureStore([]);

describe("TutorSettings component", () => {
  let store;

  beforeEach(() => {
    // Initial state of the Redux store
    const initialState = {
      auth: {
        isAuthenticated: true,
        user: { _id: "tutor_user_id", isTutor: true },
      },
    };

    // Initialize the mock store with the initial state
    store = mockStore(initialState);
  });

  it("renders properly", () => {
    render(
      <Provider store={store}>
        <TutorSettings />
      </Provider>
    );
  });

  // Example test for adding a new subject
  it("adds a new subject when clicking the 'Add' button", () => {
    render(
      <Provider store={store}>
        <TutorSettings />
      </Provider>
    );

    // Find the "Add" button and click it
    const addButton = screen.getByText("+");
    fireEvent.click(addButton);

    // Make sure the new subject input fields are visible after clicking "Add"
    const levelInput = screen.getByLabelText("Select Level of Study");
    const subjectInput = screen.getByLabelText("Select subject");
    const priceInput = screen.getByLabelText("Whare is your rate? ( /hr)");

    expect(levelInput).toBeInTheDocument();
    expect(subjectInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
  });

  it("changes the description when typing in the description input", () => {
    render(
      <Provider store={store}>
        <TutorSettings />
      </Provider>
    );

    // Find the description textarea and type a new description
    const descriptionTextarea = screen.getByLabelText("Description:");
    fireEvent.change(descriptionTextarea, {
      target: { value: "New description" },
    });

    // Make sure the description value is updated
    expect(descriptionTextarea.value).toBe("New description");
  });

  it("changes the highest level of qualification when selecting a new option", () => {
    render(
      <Provider store={store}>
        <TutorSettings />
      </Provider>
    );

    // Find the highest qualification select and select a new option
    const qualificationSelect = screen.getByLabelText("Highest Qualification:");
    fireEvent.change(qualificationSelect, {
      target: { value: "Undergraduate" },
    });

    // Make sure the highest qualification value is updated
    expect(qualificationSelect.value).toBe("Undergraduate");
  });
});
