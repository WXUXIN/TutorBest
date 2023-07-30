import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UnauthorisedViewing from "../components/profile/UnauthorisedViewing"; // Adjust the import path accordingly

describe("UnauthorisedViewing Component", () => {
    it("should display 'Sign up to chat!' button when user is not authenticated", () => {
      // Mock the auth object to simulate an unauthenticated user
      const auth = {
        isAuthenticated: false,
        loading: false,
      };
  
      // Mock the profile object with some sample data
      const profile = {
        user: {
          name: "Tutor's Name",
          photo: "tutor.jpg",
        },
        ratings: [], // You can add the sample ratings here
        subjectList: [], // You can add the sample subjects here
        description: "Tutor's description",
      };
  
      // Render the component with the mocked auth and profile objects
      render(
        <Provider store={store}>
          <MemoryRouter>
            <UnauthorisedViewing auth={auth} profiles={{ profile, loading: false }} />
          </MemoryRouter>
        </Provider>
      );
  
      // Check if the 'Sign up to chat!' button is displayed
      const signUpButton = screen.getByText("Sign up to chat!");
      expect(signUpButton).toBeInTheDocument();
    });
  
    it("should not display 'Sign up to chat!' button when user is authenticated", () => {
      // Mock the auth object to simulate an authenticated user
      const auth = {
        isAuthenticated: true,
        loading: false,
      };
  
      // Mock the profile object with some sample data
      const profile = {
        user: {
          name: "Tutor's Name",
          photo: "tutor.jpg",
        },
        ratings: [], // You can add the sample ratings here
        subjectList: [], // You can add the sample subjects here
        description: "Tutor's description",
      };
  
      // Render the component with the mocked auth and profile objects
      render(
        <Provider store={store}>
          <MemoryRouter>
            <UnauthorisedViewing auth={auth} profiles={{ profile, loading: false }} />
          </MemoryRouter>
        </Provider>
      );
  
      // Check that the 'Sign up to chat!' button is NOT displayed
      const signUpButton = screen.queryByText("Sign up to chat!");
      expect(signUpButton).not.toBeInTheDocument();
    });
  });