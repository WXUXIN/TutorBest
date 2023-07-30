import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FilteredProfiles from "../components/profiles/FilteredProfiles"; // Adjust the import path accordingly

describe("FilteredProfiles Component", () => {
    it("should update sorting option when selected", () => {
      // Render the component
      render(<FilteredProfiles />);
  
      // Select the sorting option
      const sortBySelect = screen.getByLabelText("Sort By");
      fireEvent.change(sortBySelect, { target: { value: "Rating - High to Low" } });
  
      // Verify sorting option is updated
      expect(sortBySelect.value).toBe("Rating - High to Low");
    });
  
    it("should navigate to tutor's profile when selected", () => {
      // Render the component
      render(<FilteredProfiles />);
  
      // Get a sample tutor profile item to select
      const tutorProfile = screen.getByText("Tutor's Name"); // Adjust this to match the tutor's name shown on the profile item
  
      // Click on the tutor's profile to view
      fireEvent.click(tutorProfile);
    });
  });