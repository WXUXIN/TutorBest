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


const TutorSettings = ({ stAlert, user, isAuthenticated, tutorSettings }) => {
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

  // This is to track if the user has submitted the form
  const [detailsUpdated, setDetailsUpdated] = useState(false);

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
        const copiedSubjectList = tutorData.subjectList.map((subject) => ({
          ...subject,
        }));
        
        // Set the states of all the trackers
        setSubjects(copiedSubjectList);
        setHqTracker(tutorData.highestQualification);
        setDescTracker(tutorData.description);

        // If current qualification is not in the standard set, we will update the hqTracker state to be "Others"
        // and the otherQualification to being the current qualification

        if (
          !["Secondary School", "GCE A Levels", "Undergraduate", "Graduate"].includes(
            tutorData.highestQualification
          )
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
    console.log(userData, name);
  };

  // This function checks if any subject or price field is empty
  const emptySubjectOrPrice = () =>
    subjects.some(
      (subject) =>
        subject.level && (subject.subject === "" || subject.price === "")
    );

  // This function checks if the highest qualification is empty
  const emptyQualification = () =>
    highestQualification === "" ||
    (highestQualification === "Others" && otherQualification === "");

  const purgeEmptySubjects = (subjs) =>
    subjs.filter((subject) => subject.subject !== "" && subject.price !== "");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (emptySubjectOrPrice()) {
      setAlert("Please fill in all subject and price fields", "danger");
    } else if (emptyQualification()) {
      setAlert("Please fill in your highest qualification", "danger");
    } else {

      const tempCompareList = purgeEmptySubjects(subjects);

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
    };
    setSubjects([...subjects, newSubject]);
  };

  const handleLevelChange = (index, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index].level = value;
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
  if (!subjects || !hqTracker || !descTracker) {
    return <Spinner />;
  }

  // After the user has submitted the form, we will redirect them to the tutor dashboard
  if (detailsUpdated) {
    return <Navigate to="/TutorDashboard" />;
  }

  console.log(subjects, "123");
  return (
    <section className="container">
      <h1 className="large text-primary">Edit your information here</h1>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <small className="form-text">Name</small>
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
          <small className="form-text">Email</small>
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
            <div style={{ fontFamily: "Josefin Sans", marginLeft: "0.5rem" }}>
              Edit your subject(s):
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
                    <option value="Primary School">Primary School</option>
                    <option value="Secondary School">Secondary School</option>
                    <option value="Junior College">Junior College</option>
                  </select>

                  {subject.level === "Primary School" && (
                    <select
                      value={subject.subject}
                      onChange={(e) =>
                        handleSubjectChange(index, e.target.value)
                      }
                      className="my"
                    >
                      <option value="">* Select Subject</option>
                      <option value="Pri Math">Math</option>
                      <option value="Pri Science">Science</option>
                      <option value="Pri English">English</option>
                    </select>
                  )}

                  {subject.level === "Secondary School" && (
                    <select
                      value={subject.subject}
                      onChange={(e) =>
                        handleSubjectChange(index, e.target.value)
                      }
                      className="my"
                    >
                      <option value="">* Select Subject</option>
                      <option value="Sec History">History</option>
                      <option value="Sec Computer Science">
                        Computer Science
                      </option>
                    </select>
                  )}

                  {subject.level === "Junior College" && (
                    <select
                      value={subject.subject}
                      onChange={(e) =>
                        handleSubjectChange(index, e.target.value)
                      }
                      className="my"
                    >
                      <option value="">* Select Subject</option>
                      <option value="JC Subject 1">JC Subject 1</option>
                      <option value="JC Subject 2">JC Subject 2</option>
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
            <small>Highest Qualification:</small>
              <div className="subject-wrapper">
                <select
                  value={hqTracker}
                  name="hqTracker"
                  onChange={(e) => setHqTracker(e.target.value)}
                  className="my"
                >
                  <option value="">* Select your highest qualification</option>
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
            <small>Description:</small>
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
