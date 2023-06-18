import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import { tutorReg } from "../../actions/auth";
import {
  subjectOptionsData,
  levelOfStudyTemplate,
} from "../../subjectOptionsData";

const TutorReg = ({ auth: { user }, setAlert, tutorReg }) => {
  const [subjects, setSubjects] = useState([]);

  const [qualification, setQualification] = useState("");

  const [otherQualification, setOtherQualification] = useState("");

  const [description, setDes] = useState("");

  const [role, setRole] = useState("tutor");

  const [subjectOptions, setSubjectOptions] = useState([]);

  // Event handlers
  const emptySubjectOrPrice = () =>
    subjects.some(
      (subject) =>
        subject.level && (subject.subject === "" || subject.price === "")
    );

  const emptyQualification = () =>
    qualification === "" ||
    (qualification === "Others" && otherQualification === "");

  const purgeEmptySubjects = (subjs) =>
    subjs.filter((subject) => subject.subject !== "" && subject.price !== "");

  const emptyDescription = () => description === "";

  function handleChangeRoles(e) {
    setRole(e.target.value);
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    if (emptySubjectOrPrice()) {
      setAlert("Please fill in all subject and price fields", "danger");
    } else if (emptyQualification()) {
      setAlert("Please fill in your highest qualification", "danger");
    } else if (emptyDescription()) {
      setAlert("Please fill in your description", "danger");
    } else {
      const subjectList = purgeEmptySubjects(subjects);
      const highestQualification =
        qualification === "Others" ? otherQualification : qualification;
      const isTutor = true;
      const userID = user._id;
      tutorReg({
        userID,
        isTutor,
        subjectList,
        description,
        highestQualification,
      });
    }
  };

  // When tutor press button to add subjects they teach
  const addSubject = () => {
    const newSubject = {
      subject: "",
      level: "",
      price: "",
    };
    setSubjects([...subjects, newSubject]);
  };

  const handleLevelChange = (index, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index].level = value;
    setSubjects(updatedSubjects);

    if (value in subjectOptionsData) {
      setSubjectOptions(subjectOptionsData[value]);
    } else {
      setSubjectOptions([]);
    }
  };

  const handleSubjectChange = (index, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index].subject = value;
    setSubjects(updatedSubjects);
  };

  const handlePriceChange = (index, value) => {
    // Remove any non-numeric characters from the input value
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    const updatedSubjects = [...subjects];
    updatedSubjects[index].price = sanitizedValue;
    setSubjects(updatedSubjects);
  };

  const removeSubject = (index) => {
    const updatedSubjects = [...subjects];
    updatedSubjects.splice(index, 1);
    setSubjects(updatedSubjects);
  };

  //   if (user.isTutor) {
  //     return <Navigate to="/TutorDashboard" />;
  //   }

  if (role === "tutor" && user && user.isTutor) {
    return <Navigate to="/TutorDashboard" />;
  } else if (role === "tutee") {
    return <Navigate to="/TuteeDashboard" />;
  }

  return (
    <section className="container">
      <h1>
        I am a
        <select value={role} onChange={handleChangeRoles}>
          <option value="tutee">tutee</option>
          <option value="tutor">tutor</option>
        </select>
      </h1>

      <h1>Please register as a tutor first:</h1>
      <form className="form" onSubmit={onSubmit}>
        <div style={{ fontFamily: "Josefin Sans", marginLeft: "0.5rem" }}>
          Select your subject(s):
        </div>
        {subjects.map((subject, index) => (
          <div key={index} className="form-group">
            <div className="subject-wrapper">
              <select
                value={subject.level}
                onChange={(e) => handleLevelChange(index, e.target.value)}
                className="my"
              >
                <option value="">* Select Level of Study</option>
                {levelOfStudyTemplate.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {subject.level && (
                <select
                  value={subject.subject}
                  onChange={(e) => handleSubjectChange(index, e.target.value)}
                  className="my"
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
              )}

              {subject.level !== "" && subject.subject !== "" && (
                <input
                  type="text"
                  placeholder="Price"
                  name="price"
                  value={subject.price ? `SGD ${subject.price}/hr` : `SGD`}
                  onChange={(e) => handlePriceChange(index, e.target.value)}
                  className="my"
                />
              )}

              <button
                type="button"
                className="btn cross-button"
                onClick={() => removeSubject(index)}
              >
                &#10005;
              </button>
            </div>
          </div>
        ))}

        <button type="button" className="btn" onClick={addSubject}>
          <span>&#43;</span>
        </button>

        {/* Qualification dropdown and input box */}
        <div className="form-group">
          <div className="subject-wrapper">
            <select
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              className="my"
            >
              <option value="">* Select your highest qualification</option>
              <option value="Secondary School">Secondary School</option>
              <option value="GCE A Levels">GCE A Levels</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Graduate">Graduate</option>
              <option value="Others">Others</option>
            </select>

            {qualification === "Others" && (
              <input
                type="text"
                placeholder="Enter Other Qualification"
                name="otherQualification"
                value={otherQualification}
                onChange={(e) => setOtherQualification(e.target.value)}
                className="my"
              />
            )}

            <div className="form-group">
              <small>Description:</small>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDes(e.target.value)}
                className="my"
                placeholder="Enter tutor description"
              ></textarea>
            </div>
          </div>
        </div>
        <input
          type="submit"
          style={{ fontFamily: "Josefin Sans" }}
          className="btn btn-primary"
          value="Join us as a Tutor!"
        />
      </form>
    </section>
  );
};

TutorReg.propTypes = {
  setAlert: PropTypes.func.isRequired,
  tutorReg: PropTypes.func.isRequired,
  auth: PropTypes.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { setAlert, tutorReg })(TutorReg);
