import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Profiles from "../components/profiles/Profiles"; // Adjust the import path based on your file structure

// Mock Redux store
const mockStore = configureStore([]);

describe("Profiles component", () => {
  let store;

  beforeEach(() => {
    // Initial state of the Redux store
    const initialState = {
      auth: {
        isAuthenticated: true,
        loading: false,
        user: { _id: "tutee_user_id" },
      },
      profiles: {
        loading: false,
        profiles: [

          { _id: "tutor_1_id", user: { name: "Tutor 1" }},
          { _id: "tutor_2_id", user: { name: "Tutor 2" }},
        ],
      },
    };

    // Initialize the mock store with the initial state
    store = mockStore(initialState);
  });

  it("displays the list of tutors that the tutee has linked up with", async () => {
    render(
      <Provider store={store}>
        <Profiles />
      </Provider>
    );

    // Wait for the component to render the list of tutors
    await waitFor(() => {
      // Find the tutor names in the rendered component
      const tutor1Name = screen.getByText("Tutor 1");
      const tutor2Name = screen.getByText("Tutor 2");

      // Expect that the tutor names are displayed on the page
      expect(tutor1Name).toBeInTheDocument();
      expect(tutor2Name).toBeInTheDocument();
    });
  });
});
