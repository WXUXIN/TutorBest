import React from "react";
// import { Link } from 'react-router-dom';
import { useState } from "react";
import "../../../src/App.css";
import subjectOptionsData from "../../subjectOptionsData";

// import {useEffect} from 'react';
// import { Button } from "../../../dropdown-menu"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

export default function Landing() {
  const [levelOfStudy, setLevelOfStudy] = useState("");
  const [subject, setSubject] = useState("");

  // This stores the subjects that can be selected from the dropdown
  const [subjectOptions, setSubjectOptions] = useState([]);

  // For students to select their level of study
  const handleLevelOfStudyChange = (e) => {
    const selectedLevelOfStudy = e.target.value;
    setLevelOfStudy(selectedLevelOfStudy);

    // Update subject options based on the selected level of study
    if (selectedLevelOfStudy in subjectOptionsData) {
      setSubjectOptions(subjectOptionsData[selectedLevelOfStudy]);
    } else {
      setSubjectOptions([]);
    }

    // Reset the selected subject every time the level of study is changed
    setSubject("");
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  return (
    <section className="landing">
      <div className="dark-overlay-bg"></div>
      <div className="background-image-container"></div>

      <div className="landing-inner">
        {/* {all below in landing-inner} */}

        <div
          className="box-container"
          style={{
            backgroundColor: "grey",
            padding: "100px 20px 100px",
            opacity: "1",
            borderRadius: "30px",
            position: "relative",
          }}
        >
          <h1 className="x-large-landing">
            I am in &nbsp;&nbsp;
            <select
              value={levelOfStudy}
              onChange={handleLevelOfStudyChange}
              className="dropdown"
              style={{
                fontSize: "inherit",
                backgroundColor: "grey",
                color: "#e9c78c",
                borderRadius: "30px",
                textAlign: "center",
                padding: "8px",
              }}
            >
              <option value="">Level of Study</option>
              <option value="Primary School">Primary School</option>
              <option value="Secondary School">Secondary School</option>
              <option value="Junior College">Junior College</option>
            </select>
          </h1>

          <h1 className="x-large-landing" style={{ marginTop: "30px" }}>
            I am looking for a &nbsp;&nbsp;
            <select
              value={subject}
              onChange={handleSubjectChange}
              className="dropdown"
              style={{
                fontSize: "inherit",
                backgroundColor: "grey",
                color: "#e9c78c",
                borderRadius: "30px",
                textAlign: "center",
                padding: "8px",
                
              }}
              disabled={subjectOptions.length === 0}
            >
              {subjectOptions.length === 0 ? (
                <option value="">Select level of study</option>
              ) : (
                <>
                  <option value="">Select subject</option>
                  {subjectOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </>
              )}
            </select>
            &nbsp; tutor.
          </h1>
          <div>
            <button
              style={{
                fontFamily: "Josefin Sans",
                alignSelf: "flex-start",
                backgroundColor: "#0B1B3D",
                color: "white",
                borderRadius: "5px",
                padding: "20px 30px",
                border: "none",
                outline: "none",
                cursor: "pointer",
                position: "absolute",
                bottom: "20px",
                right: "20px",
                fontSize: "25px",
              }}
            >
              Find my tutor
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
