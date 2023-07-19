import React, { useState } from "react";

// work with redux
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link, Navigate } from "react-router-dom";
import { SET_ALERT } from "../../actions/types";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import "../../App.css";
import {
  subjectOptionsData,
  levelOfStudyTemplate,
} from "../../subjectOptionsData";

// Props are arugments passed from one component to another.
const Register = ({ setAlert, register, isAuthenticated, user }) => {
  // Every time the state changes, the component re-renders,
  // meaning the webpage will update with the new state.
  const [formData, setMainData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    photo: "",
  });

  const [subjects, setSubjects] = useState([]);

  const [qualification, setQualification] = useState("");

  const [otherQualification, setOtherQualification] = useState("");

  const [description, setDes] = useState("");

  const [isTutor, setTutor] = useState(false);

  const [subjectOptions, setSubjectOptions] = useState([]);

  const { name, email, password, password2, photo } = formData;

  // Event handler
  const onChange = (e) =>
    setMainData({ ...formData, [e.target.name]: e.target.value });

  const onChangeProfilePic = (e) => {
    setMainData({ ...formData, photo: e.target.files[0] });
  };

  const emptySubjectOrPrice = () =>
    isTutor &&
    subjects.some(
      (subject) =>
        subject.level && (subject.subject === "" || subject.price === "")
    );

  const emptyQualification = () =>
    isTutor &&
    (qualification === "" ||
      (qualification === "Others" && otherQualification === ""));

  const emptyDescription = () => isTutor && description === "";

  const purgeEmptySubjects = (subjs) =>
    subjs.filter((subject) => subject.subject !== "" && subject.price !== "");

  const emptySubjectList = () => {
    return isTutor && subjects.length === 0;
  };

  const emptyProfilePic = () => {
    return photo === "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("Passwords do not match", "danger");
    } else if (emptySubjectList()) {
      setAlert("Please add at least one subject", "danger");
    } else if (emptySubjectOrPrice()) {
      setAlert("Please fill in all subject and price fields", "danger");
    } else if (emptyQualification()) {
      setAlert("Please fill in your highest qualification", "danger");
    } else if (emptyDescription()) {
      setAlert("Please fill in your description", "danger");
    } else if (emptyProfilePic()) {
      setAlert("Please upload a profile picture", "danger");
    } else {
      let subjectList = purgeEmptySubjects(subjects);

      subjectList = subjectList.map((subject) => ({
        // Remove subjectOptions from the subject object
        subject: subject.subject,
        level: subject.level,
        price: subject.price,
      }));

      const highestQualification =
        qualification === "Others" ? otherQualification : qualification;

      const formData = new FormData();

      if (subjectList.length === 0 && isTutor) {
        setAlert("Please add at least one subject", "danger");
        return;
      } else if (subjectList.length === 0 && !isTutor) {
        formData.append("subjectList", "[]");
      } else {
        // Append the subjectList array normally
        formData.append("subjectList", JSON.stringify(subjectList));
      }

      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("isTutor", isTutor);
      formData.append("description", description);
      formData.append("highestQualification", highestQualification);

      if (photo === "") {
        formData.append(photo, "default.jpg");
      } else {
        formData.append("photo", photo);
      }

      if (subjectList)
        // Using this,boundary not found error arises
        // {
        //     name,
        //     email,
        //     password,
        //     isTutor,
        //     subjectList,
        //     description,
        //     highestQualification,
        //     photo
        //   }\
        console.log(subjectList);
      console.log("gg to submiet");
      console.log(`this is the subjectList : ${formData.get("subjectList")}`);
      await register(formData);
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

  if (isAuthenticated && user && user.isTutor) {
    return <Navigate to="/TutorDashboard" />;
  } else if (isAuthenticated && user && !user.isTutor) {
    return <Navigate to="/profiles" />;
  }

  return (
    <section className="bright-overlay-bg ">
      <div className="container">
        <div className="box-container">
          <h1 className="large form-font-white">Sign Up</h1>
          
          <form
            className="form"
            onSubmit={onSubmit}
            encType="multipart/form-data"
          >
            <div className="form-group">
              <small className="text-primary form-font-white">
                Display name
              </small>
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={name}
                onChange={(e) => onChange(e)}
              />
            </div>

            <div className="form-group">
              <small className="text-primary form-font-white">
                Email Address
              </small>
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={(e) => onChange(e)}
              />
            </div>

            <div className="form-group">
              <small className="text-primary form-font-white">Password</small>
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => onChange(e)}
              />
            </div>

            <div className="form-group">
              <small className="text-primary form-font-white">
                Confirm Password
              </small>
              <input
                type="password"
                placeholder="Confirm Password"
                name="password2"
                value={password2}
                onChange={onChange}
              />
            </div>

            <small className="text-primary form-font-white">
              Upload Your Profile Picture
            </small>
            <div className="form-group">
              <input
                type="file"
                name="photo"
                accept=".png, .jpg, .jpeg"
                required
                onChange={onChangeProfilePic}
              />
            </div>

            <div className="form-group">
              <label className="themefont" style={{ fontSize: "1.5rem" }}>
                <input
                  type="checkbox"
                  checked={isTutor}
                  onChange={(e) => setTutor(!isTutor)}
                />
                <span className="form-font-gold ml-1">
                  I want to be a tutor!
                </span>
              </label>

              {isTutor ? (
                <>
                  <h3 className="form-font-white">Select your subject(s):</h3>
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
                          <option value="">* Select Academic Level</option>
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
                    <h2 className="form-font-white">Highest Qualification:</h2>
                    <div className="subject-wrapper">
                      <select
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        className="my"
                      >
                        <option value="">
                          * Select your highest qualification
                        </option>
                        <option value="Secondary School">
                          Secondary School
                        </option>
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
                          onChange={(e) =>
                            setOtherQualification(e.target.value)
                          }
                          className="my"
                        />
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <h2 className="form-font-white">Description:</h2>
                    <textarea
                      id="description"
                      name="description"
                      value={description}
                      onChange={(e) => setDes(e.target.value)}
                      className="my"
                      placeholder="Enter tutor description"
                    ></textarea>
                  </div>
                </>
              ) : null}
            </div>

            <input
              type="submit"
              style={{ fontFamily: "Josefin Sans" }}
              className="btn btn-primary"
              value="Register"
            />
          </form>

          <p className="my-1 form-font-white">
            Already have an account?{" "}
            <Link className="form-font-gold" to="/login ">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
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
export default connect(mapStateToProps, { setAlert, register })(Register);
