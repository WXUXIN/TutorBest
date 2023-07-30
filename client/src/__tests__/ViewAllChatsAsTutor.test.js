import React from "react";
import { shallow } from "enzyme";
import TutorDashboard from "../components/dashboard/TutorDashboard";

// Mock the necessary functions
const mockNavigate = jest.fn();
const mockGetTutorProfileByUserId = jest.fn();
const mockAcceptLinkingRequest = jest.fn();
const mockRejectLinkingRequest = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../actions/profile", () => ({
  getTutorProfileByUserId: mockGetTutorProfileByUserId,
}));

jest.mock("../../actions/linkingActions", () => ({
  acceptLinkingRequest: mockAcceptLinkingRequest,
  rejectLinkingRequest: mockRejectLinkingRequest,
}));

describe("TutorDashboard Component", () => {
  // Test case: Renders the tutor dashboard correctly
  it("should render the tutor dashboard correctly", () => {
    const mockProps = {
      auth: {
        user: {
          _id: "user123",
          name: "John Doe",
          photo: "avatar.jpg",
          isTutor: true,
        },
      },
      profiles: {
        profile: {
          user: {
            _id: "user123",
          },
          ratings: [],
          linkingRequests: [],
          loading: false,
        },
        loading: false,
      },
    };

    const wrapper = shallow(<TutorDashboard {...mockProps} />);
  });

  // Test case: Simulate button click and check if linking requests are shown
  it("should show linking requests when the 'Linking Requests' button is clicked", () => {
    const mockProps = {
      // Mock props data here
    };

    const wrapper = shallow(<TutorDashboard {...mockProps} />);
    // Find the "Linking Requests" button using Enzyme's find method
    const linkingRequestsButton = wrapper.find("button");
    linkingRequestsButton.simulate("click");
    // After the click, check if the linking requests are shown correctly
    // For example, check if the linking requests div is displayed and contains the correct data
  });

  // Test case: Simulate button click and check if acceptLinkingRequest is called
  it("should call acceptLinkingRequest when 'Accept' button is clicked", () => {
    const mockProps = {
      // Mock props data here
    };

    const wrapper = shallow(<TutorDashboard {...mockProps} />);
    // Find the "Accept" button using Enzyme's find method
    const acceptButton = wrapper.find(".green-box");
    acceptButton.simulate("click");
    // After the click, check if acceptLinkingRequest is called with the correct arguments
    expect(mockAcceptLinkingRequest).toHaveBeenCalledWith("user123", /* request data */);
  });

  // Test case: Simulate button click and check if rejectLinkingRequest is called
  it("should call rejectLinkingRequest when 'Decline' button is clicked", () => {
    const mockProps = {
      // Mock props data here
    };

    const wrapper = shallow(<TutorDashboard {...mockProps} />);
    // Find the "Decline" button using Enzyme's find method
    const declineButton = wrapper.find(".red-box");
    declineButton.simulate("click");
    // After the click, check if rejectLinkingRequest is called with the correct arguments
    expect(mockRejectLinkingRequest).toHaveBeenCalledWith("user123", /* request data */);
  });

  // Add more test cases for other scenarios as needed
});
