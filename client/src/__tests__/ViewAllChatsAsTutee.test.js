import React from "react";
import { shallow } from "enzyme";
import Profile from "../components/profile/Profile";

// Mock the necessary functions
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockGetAllProfiles = jest.fn();

describe("Profiles Component", () => {
  // Test case: Renders "My Chats" button
  it("should render the 'My Chats' button when authenticated", () => {
    const mockProps = {
      auth: {
        user: {
          _id: "user123",
          photo: "avatar.jpg",
        },
        isAuthenticated: true,
      },
      profiles: {
        profiles: [],
        loading: false,
      },
      getAllProfiles: mockGetAllProfiles,
      clearProfiles: jest.fn(),
    };

    const wrapper = shallow(<Profiles {...mockProps} />);
    const myChatsButton = wrapper.find("button");
    expect(myChatsButton.text()).toBe("My Chats");
  });

  // Test case: Calls navigate when the "My Chats" button is clicked
  it("should navigate to 'active-chats' when the 'My Chats' button is clicked", () => {
    const mockProps = {
      auth: {
        user: {
          _id: "user123",
          photo: "avatar.jpg",
        },
        isAuthenticated: true,
      },
      profiles: {
        profiles: [],
        loading: false,
      },
      getAllProfiles: mockGetAllProfiles,
      clearProfiles: jest.fn(),
    };

    const wrapper = shallow(<Profiles {...mockProps} />);
    const myChatsButton = wrapper.find("button");
    myChatsButton.simulate("click");
    expect(mockNavigate).toHaveBeenCalledWith("/active-chats/user123");
  });
});
