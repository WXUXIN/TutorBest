import React from "react";
// import { Link } from 'react-router-dom';
import { useState } from "react";
import "../../../src/App.css";
import {
  subjectOptionsData,
  levelOfStudyTemplate,
} from "../../subjectOptionsData";
import { Navigate, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();


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

  const handleSearch = () => {
    if (levelOfStudy && subject) {
      navigate(`/filtered-profiles?levelOfStudy=${levelOfStudy}&subject=${subject}`);
    }
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
            padding: "100px 20px 100px",
 
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
              {levelOfStudyTemplate.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
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
              disabled={!levelOfStudy || !subject}
              onClick={handleSearch}
              style={{
                fontFamily: "Josefin Sans",
                alignSelf: "flex-start",
                backgroundColor: "#e9c78c",
                color: "black",
                borderRadius: "20px",
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
