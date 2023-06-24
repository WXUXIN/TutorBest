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
  const [isRatingVisible, setIsRatingVisible] = useState(false);

  const toggleRatingVisibility = () => {
    setIsRatingVisible(!isRatingVisible);
    setHasRated(true)
  };

  // control state of whether the tutor and tutee is linked to render link button
  const [isLinked, setIsLinked] = useState(false);

  // control state of whether the tutee has rated the tutor
  const [hasRated, setHasRated] = useState(false);

  // function to check if tutor and tutee have linked and change the state of isLinked
  const isTutorLinked = () => {
    console.log("isTutorLinked");
    try {
      const tutorIDs = profiles.map((tutor) => tutor.user._id);

      console.log(
        tutorIDs.includes(profile.user._id),
        "If true, tutor and tutee are linked"
      );

      console.log(profiles, profile.user._id);

      return tutorIDs.includes(profile.user._id);
    } catch (error) {
      console.error("Error retrieving tutors:", error);
    }
  };

  useEffect(() => {
    try {
      const linked = isTutorLinked();
      setIsLinked(linked);
    } catch (error) {
      console.error("Error retrieving tutors:", error);
    }

    // Since loading will be updated once the registedProfiles are loaded, we
    // will check if the tutor and tutee are linked once the loading is updated
  }, [loading]);

  useEffect(() => {
    // This checks if the tutee has rated the tutor

    if (profile && auth.user) {
      getRegisteredProfiles(auth.user._id);

      const tuteeIds = profile.ratings.map((rating) => rating.tutee);

      if (auth.user._id) {
        const tuteeId = auth.user._id;
        setHasRated(tuteeIds.includes(tuteeId));
      }
    }
  }, [profile, auth.user]);

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
    <section className="dark-overlay-bg">
      <div className="background-image-container"></div>
      <div className="container">
        <div className="box-container">
          <h1
            className="normal-text"
            style={{ fontWeight: "bold", fontSize: "50px" }}
          >
            {profile.user.name}
          </h1>
          <Fragment>
            <h1 className="normal-text" style={{ marginTop: "20px" }}>
              {typeof getAverageRatings(profile.ratings) === "string" ? (
                <h1>Rating: {getAverageRatings(profile.ratings)}</h1>
              ) : (
                <h1>Rating: {getAverageRatings(profile.ratings)} / 5 </h1>
              )}
            </h1>
            {auth.isAuthenticated && (
              <h1 className="normal-text" style={{ marginTop: "20px" }}>
                Email: {profile.user.email}
              </h1>
            )}
            <h1 className="normal-text" style={{ marginTop: "20px" }}>
              Subjects:
            </h1>

            {profile.subjectList.length > 0 ? (
              profile.subjectList.map((subject, index) => (
                <div
                  className="normal-text"
                  style={{ marginTop: "20px", marginBottom: "20px" }}
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

          <h1 className="normal-text" style={{ marginTop: "20px" }}>
            Tutor's description:
          </h1>
          <div className="white-box" style={{ marginTop: "20px" }}>
            {profile.description}
          </div>

          {/* {auth.isAuthenticated && auth.loading === false && (
            // Chat with tutor button
            // <Link to={`/chat/${profile.user._id}`} className="btn btn-primary">
            //   Chat with tutor
            // </Link>
          )} */}

          {/* if user is logged in */}
          <div style={{ marginTop: "20px" }}>
            {auth.isAuthenticated && auth.loading === false && !isLinked && (
              // Link with tutor button
              <button
                onClick={() => {
                  makePair(profile.user._id, auth.user._id);
                  setIsLinked(true);
                }}
                className="btn btn-primary"
              >
                Link with tutor
              </button>
            )}
          </div>

          {/* rating tutor link */}
          {auth.isAuthenticated &&
            auth.loading === false &&
            isLinked &&
            !hasRated && (
              <>
                <button
                  className="btn btn-primary"
                  onClick={toggleRatingVisibility}
                >
                  Rate Tutor!
                </button>
              </>
            )}

          {isRatingVisible && (
            <RateTutor
              tutorId={profile.user._id}
              findTutorById={findTutorById}
              handleRateTutor={handleRateTutor}
              auth={auth}
            />
          )}

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
