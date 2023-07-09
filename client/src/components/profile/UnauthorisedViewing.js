import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import {
  getProfileById,
  clearProfile,
  getRegisteredProfiles,
} from "../../actions/profile";
import { makePair, findTutorById, handleRateTutor } from "../../actions/auth";
import RateTutor from "../ratingsystem/RateTutor";
import { Navigate } from "react-router-dom";

const Profile = ({
  getProfileById,
  auth,
  profiles: { profiles, profile, loading },
  makePair,
  clearProfile,
  isAuthenticated,
  getRegisteredProfiles,
}) => {
  // This gets the id from the url
  // profile id
  const { id } = useParams();

  // useEffect hook in your code is used to fetch a profile by ID when the component mounts or when the id value changes
  useEffect(() => {
    getProfileById(id);
  }, [getProfileById, id]);

  // Only when the profile is loaded, display the profile
  if (profile === null || loading) {
    return <Spinner />;
  }

  const getAverageRatings = (ratings) => {
    // Return 0 if the ratings array is empty
    if (ratings.length === 0) {
      return "No ratings yet";
    }

    // Calculate the sum of all ratings
    const sum = ratings.reduce((total, rating) => total + rating.rating, 0);

    // Calculate the average by dividing the sum by the number of ratings
    const average = sum / ratings.length;

    // Round the average to two decimal places
    return Math.round(average * 100) / 100;
  };

  return (
    <section className="bright-overlay-bg">
      <div className="background-image-container"></div>
      <div className="container">
        <div className="box-container">
          <h1
            className="form-font-gold normal-text"
            style={{ fontWeight: "bold", fontSize: "50px" }}
          >
            {profile.user.name}
          </h1>

          <img
            style={{
              marginTop: "20px",
              borderRadius: "50%",
              width: "200px",
              height: "200px",
            }}
            src={`../../../../uploads/${profile.user.photo || "default.jpg"}`}
            alt="User Avatar"
          />

          <Fragment>
            <h1
              className="form-font-white normal-text"
              style={{
                marginTop: "20px",
                fontWeight: "bold",
                fontSize: "25px",
              }}
            >
              Rating:
            </h1>

            <h1 className="form-font-white normal-text" style={{ marginTop: "15px" }}>
              {typeof getAverageRatings(profile.ratings) === "string" ? (
                <h1>{getAverageRatings(profile.ratings)}</h1>
              ) : (
                <h1>{getAverageRatings(profile.ratings)} / 5 </h1>
              )}
            </h1>

            <h1
              className="form-font-white normal-text"
              style={{
                marginTop: "20px",
                fontWeight: "bold",
                fontSize: "25px",
              }}
            >
              Email:
            </h1>

            {auth.isAuthenticated ? (
              <h1 className="form-font-white normal-text" style={{ marginTop: "20px" }}>
                {profile.user.email}
              </h1>
            ) : (
              <h1 className="form-font-white normal-text" style={{ marginTop: "20px" }}>
                Sign Up to view email!{" "}
              </h1>
            )}

            <h1
              className="form-font-white normal-text"
              style={{
                marginTop: "20px",
                fontWeight: "bold",
                fontSize: "25px",
              }}
            >
              Subjects:
            </h1>

            {profile.subjectList.length > 0 ? (
              profile.subjectList.map((subject, index) => (
                <div
                  className="form-font-white normal-text"
                  style={{ marginTop: "15px", marginBottom: "15px" }}
                  key={index}
                >
                  <ul
                    style={{
                      listStyleType: "disc",
                      marginLeft: "20px",
                      marginBottom: "10px",
                    }}
                  >
                    <li>
                      Subject: {subject.subject} | Level: {subject.level} |
                      Price: ${subject.price}/hr
                    </li>
                  </ul>
                </div>
              ))
            ) : (
              <h1>No subjects</h1>
            )}
          </Fragment>

          <h1
            className="form-font-white normal-text"
            style={{ marginTop: "20px", fontWeight: "bold", fontSize: "25px" }}
          >
            Tutor's description:
          </h1>
          <div className="white-box normal-text" style={{ marginTop: "20px" }}>
            {profile.description}
          </div>

          {!auth.isAuthenticated && auth.loading === false && (
            // Chat with tutor button
            <Link to={`/register`} className="btn btn-primary">
              Sign up to chat!
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  clearProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profiles: PropTypes.object.isRequired,
  getRegisteredProfiles: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profiles: state.profiles,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getProfileById,
  makePair,
  clearProfile,
  getRegisteredProfiles,
})(Profile);
