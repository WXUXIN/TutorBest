import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getAllProfiles, clearProfiles } from "../../actions/profile";
import { Navigate, useNavigate } from "react-router-dom";
import ProfileItem from "./ProfileItem";
import {
  subjectOptionsData,
  levelOfStudyTemplate,
} from "../../subjectOptionsData";

const Profiles = ({
  auth: { user, isAuthenticated },
  profiles,
  getAllProfiles,
  clearProfiles,
}) =>
  // I want to display all of the tutors in the database
  {
    // const [profilesList, setProfiles] = useState([]);
    const [role, setRole] = useState("tutee");

    // This stores the selection of the level of study
    const [levelOfStudy, setLevelOfStudy] = useState("");

    // This stores the subject selected by tutee
    const [subject, setSubject] = useState("");

    const navigate = useNavigate();

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

    // Calls the getAllProfiles action once to get the
    // latest list of profiles from the database
    useEffect(() => {
      // clearProfiles();
      console.log("useEffect called for profiles");
      // This will call the getAllProfiles action
      // to store all the profiles in the redux store
      getAllProfiles();
    }, []);

    // Updates the profilesList state variable
    // Rerun when the profiles state variable is updated
    // useEffect(() => {
    //   setProfiles(profiles.profiles);
    //   console.log(profilesList);
    // }, [profiles.profiles]);

    function handleChangeRoles(e) {
      setRole(e.target.value);
    }

    if (isAuthenticated) {
      // when the user selects tutee, we will render the tutee dashboard
      if (role === "tutor" && user && user.isTutor) {
        return <Navigate to="/TutorDashboard" />;
      } else if (role === "tutor" && user && !user.isTutor) {
        return <Navigate to="/TutorReg" />;
      }
    }

    if (profiles.loading) {
      return <Spinner />;
    }

    const handleSearch = () => {
      if (levelOfStudy && subject) {
        navigate(
          `/filtered-profiles?levelOfStudy=${levelOfStudy}&subject=${subject}`
        );
      }
    };

    // Display all the profiles of tutors in the database

    return (
      <section className="dark-overlay-bg">
        <div className="background-image-container"></div>

        <div className="container">
          <div className="box-container">
            {isAuthenticated && (
              <h1
                className="normal-text"
                style={{ position: "absolute", top: "10px" }}
              >
                I am a
                <select
                  className="role-dropdown"
                  value={role}
                  onChange={handleChangeRoles}
                >
                  <option value="tutee">tutee</option>
                  <option value="tutor">tutor</option>
                </select>
              </h1>
            )}
            <div style={{ marginTop: "20px", marginBottom: "20px" }}>
              <div style={{ marginTop: "20px" }}>
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
                    float: "left",
                    marginRight: "10px",
                  }}
                >
                  <option value="">Level of Study</option>
                  {levelOfStudyTemplate.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}

                  {/* <option value="Primary School">Primary School</option>
              <option value="Secondary School">Secondary School</option>
              <option value="Junior College">Junior College</option> */}
                </select>
              </div>

              <div style={{ marginRight: "10px" }}>
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
                    float: "left",
                    marginRight: "10px",
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
              </div>

              <button
                className="btn btn-primary"
                disabled={!levelOfStudy || !subject}
                onClick={handleSearch}
              >
                Search for tutors
              </button>

              {isAuthenticated && (
                <Link
                  to={`/registered-tutors/${user._id} `}
                  className="btn btn-primary"
                >
                  View all YOUR tutors
                </Link>
              )}

              <div style={{ marginTop: "10px" }}>
                {profiles.profiles.length > 0 && !profiles.loading ? (
                  <Fragment>
                    {profiles.profiles.map((profile) => (
                      <ProfileItem key={profile._id} profile={profile} />
                    ))}
                  </Fragment>
                ) : profiles.profiles.length === 0 && !profiles.loading ? (
                  <h4>No profiles found...</h4>
                ) : (
                  <Spinner />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

Profiles.propTypes = {
  auth: PropTypes.isRequired,
  getAllProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  clearProfiles: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profiles: state.profiles,
});

export default connect(mapStateToProps, { getAllProfiles, clearProfiles })(
  Profiles
);
