import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getRegisteredProfiles, clearProfiles } from "../../actions/profile";
import { Navigate, useNavigate } from "react-router-dom";
import ProfileItem from "./ProfileItem";
import {
  subjectOptionsData,
  levelOfStudyTemplate,
} from "../../subjectOptionsData";

const RegisterdTutors = ({
  auth: { user, isAuthenticated },
  profiles,
  getRegisteredProfiles,
}) =>
  // I want to display all of the registered tutors in the database
  {
    const { id } = useParams();
    const [profilesList, setProfiles] = useState([]);
    const [role, setRole] = useState("tutee");
    const navigate = useNavigate();

    // This stores the subjects that can be selected from the dropdown
    const [subjectOptions, setSubjectOptions] = useState([]);

    // //searchbar states
    // const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // Calls the getAllProfiles action once to get the
    // latest list of profiles from the database
    useEffect(() => {
      clearProfiles();
      console.log("useEffect called for profiles");
      // This will call the getAllProfiles action
      // to store all the profiles in the redux store
      getRegisteredProfiles(id);
    }, []);

    // Updates the profilesList state variable
    // Rerun when the profiles state variable is updated
    useEffect(() => {
      setProfiles(profiles.profiles);
    }, [profiles.profiles]);

    // updating of search results spontaneously
    useEffect(() => {
      if (profiles && profiles.profiles) {
        setSearchResults(profiles.profiles);
      }
    }, [profiles]);

    function handleChangeRoles(e) {
      setRole(e.target.value);
    }

    if (profiles.loading || !user) {
      return <Spinner />;
    }

    if (isAuthenticated) {
      // when the user selects tutee, we will render the tutee dashboard
      if (role === "tutor" && user && user.isTutor) {
        return <Navigate to="/TutorDashboard" />;
      } else if (role === "tutor" && user && !user.isTutor) {
        return <Navigate to="/TutorReg" />;
      }
    }

    // Display all the profiles of tutors in the database

    return (
      <section className="bright-overlay-bg">
        <div
          className="container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            className="box-container"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                marginBottom: "20px",
              }}
            >
              {isAuthenticated && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <h1
                    className="i-am-a-dropdown normal-text"
                    style={{ color: "white", marginRight: "5px" }}
                  >
                    I am a
                  </h1>
                  <select
                    className="role-dropdown"
                    value={role}
                    onChange={handleChangeRoles}
                    style={{
                      fontSize: "inherit",
                      backgroundColor: "grey",
                      color: "#e9c78c",
                      borderRadius: "30px",
                      textAlign: "center",
                      padding: "8px",
                      marginRight: "10px",
                    }}
                  >
                    <option value="tutee">Tutee</option>
                    <option value="tutor">Tutor</option>
                  </select>

                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      navigate(`/active-chats/${user._id}`);
                    }}
                  >
                    My Chats
                  </button>
                </div>
              )}
            </div>

            {/* search bar input rendering */}

            <div style={{ marginTop: "10px" }}>
              {profilesList.length > 0 ? (
                <Fragment>
                  {profilesList.map((profile) => (
                    <ProfileItem key={profile._id} profile={profile} />
                  ))}
                </Fragment>
              ) : (
                <h4 className="normal-text">No profiles found...</h4>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };

RegisterdTutors.propTypes = {
  auth: PropTypes.isRequired,
  getRegisteredProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profiles: state.profiles,
});

export default connect(mapStateToProps, { getRegisteredProfiles })(
  RegisterdTutors
);
