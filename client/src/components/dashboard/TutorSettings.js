import React, { useState } from "react";

// work with redux
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link, Navigate } from "react-router-dom";
import { SET_ALERT } from "../../actions/types";
import { setAlert } from "../../actions/alert";
import "../../App.css";
import axios from "axios";
import { useEffect } from "react";
import { tutorSettings } from "../../actions/auth";
import Spinner from "../layout/Spinner";
import {
  subjectOptionsData,
  levelOfStudyTemplate,
} from "../../subjectOptionsData";

const TutorSettings = ({ setAlert, user, isAuthenticated, tutorSettings }) => {
  // Every time the state changes, the component re-renders,
  // meaning the webpage will update with the new state.
  const [userData, setUserData] = useState({});

  const [tutorData, setTutorData] = useState({});

  // This is to track the subject change if there are any
  const [subjects, setSubjects] = useState([]);

  // This is to track qualification change if there are any
  const [hqTracker, setHqTracker] = useState("");

  // This is to track description change if there are any
  const [descTracker, setDescTracker] = useState("");

  const [otherQualification, setOtherQualification] = useState("");

  const [subjectOptions, setSubjectOptions] = useState([]);

  // This is to track if the user has submitted the form
  const [detailsUpdated, setDetailsUpdated] = useState(false);

  const [readyForEdit, setReadyForEdit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Returns the user data from the database
        // {
        //     id
        //     name
        //     email
        //     avatar
        // }

        const userRes = await axios.get("/api/auth");
        const userData = userRes.data;
        setUserData(userData);

        const tutorRes = await axios.get("/api/tutorData");
        const tutorData = tutorRes.data;
        setTutorData(tutorData);

        // Create a deep copy of subjectList and store it in subjects
        const copiedSubjectList = tutorData.subjectList.map((subject) => {
          if (subject.level in subjectOptionsData) {
            return {
              ...subject,
              subjectOptions: subjectOptionsData[subject.level],
            };
          } else {
            return {
              ...subject,
            };
          }
        });

        // Set the states of all the trackers
        setSubjects(copiedSubjectList);
        setHqTracker(tutorData.highestQualification);
        setDescTracker(tutorData.description);
        setReadyForEdit(true);

        // If current qualification is not in the standard set, we will update the hqTracker state to be "Others"
        // and the otherQualification to being the current qualification

        if (
          ![
            "Secondary School",
            "GCE A Levels",
            "Undergraduate",
            "Graduate",
          ].includes(tutorData.highestQualification)
        ) {
          setHqTracker("Others");
          setOtherQualification(tutorData.highestQualification);
        }
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    fetchData();
  }, []);

  const { name, email } = userData;
  const { subjectList, highestQualification, description } = tutorData;

  //   Event handler
  const onUserDataChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // This function checks if any subject or price field is empty
  const emptySubjectOrPrice = () =>
    subjects.some(
      (subject) =>
        subject.level && (subject.subject === "" || subject.price === "")
    );

  // This function checks if the highest qualification is empty
  const emptyQualification = () =>
    hqTracker === "" ||
    highestQualification === "" ||
    (highestQualification === "Others" && otherQualification === "");

  const purgeEmptySubjects = (subjs) =>
    subjs.filter((subject) => subject.subject !== "" && subject.price !== "");

  const emptySubjectList = () => {
    return subjects.length === 0;
  };

  const emptyDescription = () => descTracker === "";

  const onSubmit = async (e) => {
    e.preventDefault();
    if (emptySubjectOrPrice()) {
      setAlert("Please fill in all subject and price fields", "danger");
    } else if (emptySubjectList()) {
      setAlert("Please add at least one subject", "danger");
    } else if (emptyQualification()) {
      setAlert("Please fill in your highest qualification", "danger");
    } else if (emptyDescription()) {
      setAlert("Please fill in your description", "danger");
    } else {
      let tempCompareList = purgeEmptySubjects(subjects);

      tempCompareList = tempCompareList.map((subject) => ({
        // Remove subjectOptions from the subject object
        subject: subject.subject,
        level: subject.level,
        price: subject.price,
      }));

      if (tempCompareList.length === 0) {
        setAlert("Please add at least one subject", "danger");
        return;
      }

      const newSubjectList =
        JSON.stringify(tempCompareList) !== JSON.stringify(subjectList)
          ? tempCompareList
          : [];

      // If there is a change in the highest qualification, we will update it
      let newHighestQualification = "";

      // If there is change and the new highest qualification is "Others", we will update it
      if (hqTracker !== highestQualification && hqTracker === "Others") {
        newHighestQualification = otherQualification;

        // If there is change and the new highest qualification is the standard set, we will update it
      } else if (hqTracker !== highestQualification && hqTracker !== "Others") {
        newHighestQualification = hqTracker;
      } else {
        newHighestQualification = "";
      }

      let newDescription = "";

      if (descTracker !== description) {
        newDescription = descTracker;
      } else {
        newDescription = "";
      }

      // If there is no change to original user data, we send it as either [] (subjectList) or "" (highestQualification, description)
      await tutorSettings({
        userID: user._id,
        subjectList: newSubjectList,
        highestQualification: newHighestQualification,
        description: newDescription,
      });

      setDetailsUpdated(true);
    }
  };

  // When tutor press button to add subjects they teach
  const addSubject = () => {
    const newSubject = {
      subject: "",
      level: "",
      price: "",
      subjectOptions: [],
    };
    setSubjects([...subjects, newSubject]);
  };

  const handleLevelChange = (index, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index].level = value;

    if (value in subjectOptionsData) {
      updatedSubjects[index].subjectOptions = subjectOptionsData[value];
    }

    setSubjects(updatedSubjects);
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

  // Makes sure no tuteee can access this page
  if (isAuthenticated && user && !user.isTutor) {
    return <Navigate to="/profiles" />;
  }

  // Make sure that the website is ready to track the user data
  if (readyForEdit === false) {
    return <Spinner />;
  }

  // After the user has submitted the form, we will redirect them to the tutor dashboard
  if (detailsUpdated) {
    return <Navigate to="/TutorDashboard" />;
  }

  return (
    <section className="bright-overlay-bg">
      <div className="background-image-container"></div>
      <div className="container">
        <div className="box-container">
          <h1 className="large text-primary">Edit your information here</h1>
          <form className="form" onSubmit={onSubmit}>
            <div className="form-group">
              <small className="form-font-white normal-text">Name</small>
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={name}
                onChange={(e) => onUserDataChange(e)}
                disabled={true}
              />
            </div>

            <div className="form-group">
              <small className="form-font-white normal-text">Email</small>
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={(e) => onUserDataChange(e)}
                disabled={true}
              />
            </div>

            <div className="form-group">
              <>
                <div className="form-font-white normal-text">
                  Edit your subject(s):
                </div>
                {subjects.map((subject, index) => (
                  <div key={index} className="form-group">
                    <div className="subject-wrapper">
                      <select
                        value={subject.level}
                        onChange={(e) =>
                          handleLevelChange(index, e.target.value)
                        }
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
                          onChange={(e) =>
                            handleSubjectChange(index, e.target.value)
                          }
                          className="my"
                        >
                          {subject.subjectOptions.length === 0 ? (
                            <option value="">Select level of study</option>
                          ) : (
                            <>
                              <option value="">Select subject</option>
                              {subject.subjectOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </>
                          )}
                        </select>
                      )}

                      {subject.level !== "" && subject.subject !== "" && (
                        <div>
                          <small className="text-primary form-font-white">
                            Whare is your rate? ( /hr)
                          </small>
                          <input
                            type="text"
                            placeholder="Price"
                            name="price"
                            value={subject.price ? `$${subject.price}` : "$"}
                            onChange={(e) =>
                              handlePriceChange(index, e.target.value)
                            }
                            className="my"
                          />
                        </div>
                      )}

                      <button
                        type="button"
                        className="btn cross-button btn-danger"
                        onClick={() => removeSubject(index)}
                      >
                        &#10005;
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn  btn-success cross-button  "
                  onClick={addSubject}
                >
                  <span>&#43;</span>
                </button>

                {/* Qualification dropdown and input box */}
                <div className="form-group">
                  <small className="form-font-white normal-text normal-text">Highest Qualification:</small>
                  <div className="subject-wrapper">
                    <select
                      value={hqTracker}
                      name="hqTracker"
                      onChange={(e) => setHqTracker(e.target.value)}
                      className="my"
                    >
                      <option value="">
                        * Select your highest qualification
                      </option>
                      <option value="Secondary School">Secondary School</option>
                      <option value="GCE A Levels">GCE A Levels</option>
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Others">Others</option>
                    </select>

                    {hqTracker === "Others" && (
                      <input
                        type="text"
                        placeholder="Enter Other Qualification"
                        name="otherQualification"
                        value={otherQualification}
                        // update the otherQualification state
                        onChange={(e) => setOtherQualification(e.target.value)}
                        className="my"
                      />
                    )}
                  </div>
                </div>
              </>

              {/* Description input box */}
              <div className="form-group">
                <small className="form-font-white normal-text normal-text">Description:</small>
                <textarea
                  id="description"
                  name="description"
                  value={descTracker}
                  onChange={(e) => setDescTracker(e.target.value)}
                  className="my"
                  placeholder="Enter tutor description"
                ></textarea>
              </div>
            </div>

            <input
              type="submit"
              style={{ fontFamily: "Josefin Sans" }}
              className="btn btn-primary"
              value="Submit Edits"
            />
          </form>
        </div>
      </div>
    </section>
  );
};

TutorSettings.propTypes = {
  setAlert: PropTypes.func.isRequired,
  tutorSettings: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object.isRequired,
};

// The mapStateToProps function is used to map the user data from the Redux
// store to the user prop of the component. It assumes that the user data is stored
// in the auth reducer's user property.
// Adjust the state.auth.user path according to your actual Redux store structure.
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

// The connect function is used to connect the component to the Redux store,
// making the user data available as a prop in the Dashboard component.
export default connect(mapStateToProps, { setAlert, tutorSettings })(
  TutorSettings
);
