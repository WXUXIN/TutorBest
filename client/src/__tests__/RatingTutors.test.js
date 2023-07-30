import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Profile from "../components/profile/Profile"; // Adjust the import path based on your file structure

// Mock Redux store
const mockStore = configureStore([]);

describe("Profile component", () => {
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
        
          { _id: "tutor_id", user: { _id: "tutor_id", name: "Tutor", /* other properties */ }},
        ],
      },
    };

    // Initialize the mock store with the initial state
    store = mockStore(initialState);
  });

  it("should show the 'Rate Tutor' button when tutor is linked and tutee has not rated yet", async () => {
    render(
      <Provider store={store}>
        <Profile id="tutor_id" />
      </Provider>
    );

    // Wait for the component to render
    await waitFor(() => {
      // Find the 'Rate Tutor' button in the rendered component
      const rateTutorButton = screen.getByText("Rate Tutor!");

      // Expect that the 'Rate Tutor' button is displayed on the page
      expect(rateTutorButton).toBeInTheDocument();
    });
  });

  it("should not show the 'Rate Tutor' button when tutor is not linked", async () => {
    // Modify the initial state to simulate that the tutor is not linked
    const initialState = {
      ...initialState,
      profiles: {
        ...initialState.profiles,
        profiles: [
          { _id: "tutor_id", user: { _id: "tutor_id", name: "Tutor"}, },
        ],
      },
    };

    // Initialize the mock store with the modified initial state
    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <Profile id="tutor_id" />
      </Provider>
    );

    // Wait for the component to render
    await waitFor(() => {
      // Find the 'Rate Tutor' button in the rendered component
      const rateTutorButton = screen.queryByText("Rate Tutor!");

      // Expect that the 'Rate Tutor' button is not displayed on the page
      expect(rateTutorButton).toBeNull();
    });
  });

  it("should not show the 'Rate Tutor' button when tutee has already rated", async () => {
    // Modify the initial state to simulate that the tutee has already rated
    const initialState = {
      ...initialState,
      profiles: {
        ...initialState.profiles,
        profiles: [
    
          {
            _id: "tutor_id",
            user: { _id: "tutor_id", name: "Tutor"},
            ratings: [{ tutee: { tuteeId: "tutee_user_id" }}],
            /* other properties */
          },
        ],
      },
    };

    // Initialize the mock store with the modified initial state
    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <Profile id="tutor_id" />
      </Provider>
    );

    // Wait for the component to render
    await waitFor(() => {
      // Find the 'Rate Tutor' button in the rendered component
      const rateTutorButton = screen.queryByText("Rate Tutor!");

      // Expect that the 'Rate Tutor' button is not displayed on the page
      expect(rateTutorButton).toBeNull();
    });
  });

  it("should show the 'Rate Tutor' form when the 'Rate Tutor' button is clicked", async () => {
    render(
      <Provider store={store}>
        <Profile id="tutor_id" />
      </Provider>
    );

    // Wait for the component to render
    await waitFor(() => {
      // Find the 'Rate Tutor' button in the rendered component
      const rateTutorButton = screen.getByText("Rate Tutor!");

      // Click on the 'Rate Tutor' button
      fireEvent.click(rateTutorButton);
    });

    // Wait for the 'Rate Tutor' form to be rendered
    await waitFor(() => {
      // Find the 'Rate Tutor' form in the rendered component
      const rateTutorForm = screen.getByText("Rate Tutor Form");

      // Expect that the 'Rate Tutor' form is displayed on the page
      expect(rateTutorForm).toBeInTheDocument();
    });
  });
});

