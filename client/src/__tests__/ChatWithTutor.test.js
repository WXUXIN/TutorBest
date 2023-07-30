import React from "react";
import { shallow } from "enzyme";
import Profile from "../components/profile/Profile";

// Mock the necessary functions
jest.mock("../../actions/chatRoom", () => ({
  getChatID: jest.fn().mockResolvedValue("chatRoomId123"),
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Profile Component", () => {
  // Test case: Renders "Chat with tutor!" button
  it("should render the chat button when authenticated", () => {
    const mockProps = {
      getProfileById: jest.fn(),
      auth: {
        isAuthenticated: true,
        loading: false,
        user: {
          _id: "user123",
        },
      },
      // Add other necessary props here
    };

    const wrapper = shallow(<Profile {...mockProps} />);
    const chatButton = wrapper.find("button");
    expect(chatButton.text()).toBe("Chat with tutor!");
  });

  // Test case: Calls onChatClick when "Chat with tutor!" button is clicked
  it("should call onChatClick when the chat button is clicked", () => {
    const mockProps = {
      getProfileById: jest.fn(),
      auth: {
        isAuthenticated: true,
        loading: false,
        user: {
          _id: "user123",
        },
      },
    };

    const wrapper = shallow(<Profile {...mockProps} />);
    const chatButton = wrapper.find("button");
    chatButton.simulate("click");
    expect(getChatID).toHaveBeenCalledWith("user123", "profileId123");
  });

  // Test case: Navigates to the chat room when "Chat with tutor!" button is clicked
  it("should navigate to the chat room when the chat button is clicked", () => {
    const mockProps = {
      getProfileById: jest.fn(),
      auth: {
        isAuthenticated: true,
        loading: false,
        user: {
          _id: "user123",
        },
      },
    };

    const wrapper = shallow(<Profile {...mockProps} />);
    const chatButton = wrapper.find("button");
    chatButton.simulate("click");
    expect(mockNavigate).toHaveBeenCalledWith("/chatRoom/chatRoomId123");
  });

  // Add more test cases for other scenarios as needed
});
