import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getAllProfiles } from "../../actions/profile";
import { Navigate } from "react-router-dom";
import ProfileItem from "./ProfileItem";

const Profiles = ({
  auth: { user, isAuthenticated },
  profiles,
  getAllProfiles,
}) =>
  // I want to display all of the tutors in the database
  {
    const [profilesList, setProfiles] = useState([]);
    const [role, setRole] = useState("tutee");

    // Calls the getAllProfiles action once to get the 
    // latest list of profiles from the database
    useEffect(() => {
      console.log("useEffect called for profiles");
      // This will call the getAllProfiles action
      // to store all the profiles in the redux store
      getAllProfiles();
    }, []);

    // Updates the profilesList state variable
    // Rerun when the profiles state variable is updated
    useEffect(() => {
      setProfiles(profiles.profiles);
      console.log(profilesList);

      // Run the function again when the getAllProfiles function is updated
      // If the getAllProfiles function is updated externally
      //   (e.g., due to a code change or a new dispatch),
      //   the effect will re-run with the updated function.
    }, [profiles.profiles]);

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

    if (profilesList.length === 0) {
        return <Spinner />;
    }

    // Display all the profiles of tutors in the database

    return (
      <section className="container">
        {isAuthenticated && (
          <h1>
            I am a
            <select value={role} onChange={handleChangeRoles}>
              <option value="tutee">tutee</option>
              <option value="tutor">tutor</option>
            </select>
          </h1>
        )}

        {profilesList.length > 0 ? (
          <Fragment>
            {profilesList.map((profile) => (
              <ProfileItem key={profile._id} profile={profile} />
            ))}
          </Fragment>
        ) : (
          <h4>No profiles found...</h4>
        )}
      </section>
    );
  };

Profiles.propTypes = {
  auth: PropTypes.isRequired,
  getAllProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profiles: state.profiles,
});

export default connect(mapStateToProps, { getAllProfiles })(Profiles);
