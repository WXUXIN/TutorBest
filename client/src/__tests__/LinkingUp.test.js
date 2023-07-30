import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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
        profile: {
          _id: "tutor_profile_id",
          user: { _id: "tutor_user_id" },
          ratings: [], // Set up other required fields of the profile as needed
          linkingRequests: [],
          subjectList: [],
          description: "Tutor's description",
        },
      },
    };

    // Initialize the mock store with the initial state
    store = mockStore(initialState);
  });

  it("sends a linking request when the 'Link with tutor' button is clicked", async () => {
    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    // Find the "Link with tutor" button
    const linkButton = screen.getByText("Link with tutor");

    // Click the "Link with tutor" button
    fireEvent.click(linkButton);

    const requestPendingMessage = await screen.findByText("Request pending..");
    expect(requestPendingMessage).toBeInTheDocument();
  });
});
