import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Landing from "../components/layout/Landing";


// Mock the Redux store
const mockStore = configureStore([]);
const store = mockStore({});

// 1 
describe("Landing Page", () => {
  it("should update Level of Study and subject when selected", () => {
    // Render the component
    render(<Landing />);

    // Select Level of Study
    const levelOfStudySelect = screen.getByLabelText("Level of Study");
    fireEvent.change(levelOfStudySelect, { target: { value: "Primary School" } });

    // Verify Level of Study is updated
    expect(levelOfStudySelect.value).toBe("College");

    // Select subject
    const subjectSelect = screen.getByLabelText("Select subject");
    fireEvent.change(subjectSelect, { target: { value: "English" } });

    // Verify subject is updated
    expect(subjectSelect.value).toBe("English");
  });

  it("should trigger search when 'Find my tutor' button is clicked", () => {
    // Render the component
    render(<Landing />);

    // Select Level of Study
    const levelOfStudySelect = screen.getByLabelText("Level of Study");
    fireEvent.change(levelOfStudySelect, { target: { value: "Primary School" } });

    // Select subject
    const subjectSelect = screen.getByLabelText("Select subject");
    fireEvent.change(subjectSelect, { target: { value: "English" } });

    // Click the 'Find my tutor' button
    const findTutorButton = screen.getByText("Find my tutor");
    fireEvent.click(findTutorButton);
  });
});



