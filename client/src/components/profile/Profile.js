import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import ReviewBox from "../ratingsystem/ReviewBox";
import {
  getProfileById,
  clearProfile,
  getRegisteredProfiles,
} from "../../actions/profile";
import { findTutorById, handleRateTutor } from "../../actions/auth";
import RateTutor from "../ratingsystem/RateTutor";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { sendLinkingRequest, unlinkPair } from "../../actions/linkingActions";
import { getChatID } from "../../actions/chatRoom";

const Profile = ({
  getProfileById,
  auth,
  profiles: { profiles, profile, loading },
  clearProfile,
  isAuthenticated,
  getRegisteredProfiles,
  getChatID,
  sendLinkingRequest,
  unlinkPair
}) => {
  // This gets the id from the url
  // profile id
  const { id } = useParams();
  const [isRatingVisible, setIsRatingVisible] = useState(false);

  // control state of whether the tutor and tutee is linked to render link button
  const [isLinked, setIsLinked] = useState(false);

  // control state of whether the tutee has rated the tutor
  const [hasRated, setHasRated] = useState(false);

  // control state of sent linking request pending or not
  const [isRequestPending, setIsRequestPending] = useState(false);

  // control how many reviews are shown
  const [showReviewCount, setShowReviewCount] = useState(3);

  // control confirmation of unlink
  const [showUnlink, setShowUnlink] = useState(false);

  const navigate = useNavigate();

  const toggleRatingVisibility = () => {
    setIsRatingVisible(!isRatingVisible);
    setHasRated(true);
  };

  // function to check if tutor and tutee have linked and change the state of isLinked
  const isTutorLinked = () => {
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

  const onChatClick = (userID, profileID) => {
    // Write a function to:
    // 1. Check if there exist chat between tutor and tutee
    // 2. If there is, redirect to the chat page
    // 3. If there isn't, create a new chat between tutor and tutee
    // 4. Redirect to the chat page
    // This function is to be an action in chatRoom.js

    // The function should return the chat room id
    // And in this function, we should redirect to the chat room page
    getChatID(userID, profileID).then((chatID) => {
      navigate(`/chatRoom/${chatID}`);
    });
  };

  const handleShowUnlink = () => {
    setShowUnlink(!showUnlink);
    console.log(showUnlink);
  };

  // Update redux profile by tutor ID
  useEffect(() => {
    getProfileById(id);
  }, [getProfileById, id]);

  // Used to check if the user has rated the tutor
  useEffect(() => {
    if (profile && auth.user) {
      // Makes sure if the user is logged in, they cannot view their own profile
      if (profile.user._id === auth.user._id) {
        navigate("/TutorDashboard");
      }
      getRegisteredProfiles(auth.user._id);
      const tuteeIds = profile.ratings.map((rating) => rating.tutee.tuteeId);
      if (auth.user._id) {
        const tuteeId = auth.user._id;
        setHasRated(tuteeIds.includes(tuteeId));
      }
    }
  }, [profile, auth.user]);

  // check if sent linking request
  useEffect(() => {
    console.log("hi");
    try {
      const requests = profile.linkingRequests.map((request) => request.tutee);
      setIsRequestPending(requests.includes(auth.user._id));
      console.log(setIsRequestPending(requests.includes(auth.user._id)));
    } catch (error) {
      console.error("Error retrieving requests:", error);
    }
  }, [loading]);

  // check if linked
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

  // If user unauthorised, redirect to unauthorised viewing
  if (auth.isAuthenticated === false) {
    // Include in the id inside the route
    return <Navigate to={`/unauthorised-profile-viewing/${id}`} />;
  }

  // Only when the profile is loaded, display the profile
  if (!profile || loading || !auth.user) {
    return <Spinner />;
  }

  // Makes sure if the user is logged in, they cannot view their own profile
  if (profile.user._id === auth.user._id) {
    return <Navigate to="/TutorDashboard" />;
  }

  return (
    <section className="bright-overlay-bg">
      <div className="container">
        <div className="box-container">
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <h1
              className="form-font-gold normal-text"
              style={{ fontWeight: "bold", fontSize: "50px" }}
            >
              {profile.user.name}
            </h1>
            {auth.isAuthenticated && auth.loading === false && isLinked && (
              <button className="btn btn-primary normal-text"
                style={{ fontSize:'20px'}}
                onClick={handleShowUnlink}
              >
              Unlink</button>
              )}
          </div>

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

            <h1
              className="form-font-white normal-text"
              style={{ marginTop: "15px" }}
            >
              {typeof getAverageRatings(profile.ratings) === "string" ? (
                <h1>{getAverageRatings(profile.ratings)}</h1>
              ) : (
                <h1>{getAverageRatings(profile.ratings)} / 5 </h1>
              )}
            </h1>

            {auth.isAuthenticated && (
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
            )}
            {auth.isAuthenticated ? (
              <h1
                className="form-font-white normal-text"
                style={{ marginTop: "20px" }}
              >
                {profile.user.email}
              </h1>
            ) : (
              <h1
                className="form-font-white normal-text"
                style={{ marginTop: "20px" }}
              >
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
            style={{
              marginTop: "20px",
              fontWeight: "bold",
              fontSize: "25px",
            }}
          >
            Tutor's description:
          </h1>
          <div className="white-box normal-text" style={{ marginTop: "20px" }}>
            {profile.description}
          </div>

          <h1
            className="form-font-white normal-text"
            style={{ marginTop: "20px", marginBottom:'20px', fontWeight: "bold", fontSize: "25px" }}
          >
            Tutor's reviews:
          </h1>
          <div>
          {profile.ratings.length > 0 ? (
            profile.ratings.slice(0, showReviewCount).map((review, index) => (
              <ReviewBox review={review} key={index} />
            ))
          ) : (
            <div className="normal-text form-font-white">
              No reviews yet ...
            </div>
            )}

            {/* Show More button */}
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>

            {profile.ratings.length > showReviewCount && showReviewCount === 3 && (
              <button
                className="btn btn-primary"
                style={{ marginTop: '10px', backgroundColor:'grey', color: 'white'}}
                onClick={() => setShowReviewCount(profile.ratings.length)}
              >
                Show More
              </button>
            )}

            {/* Show Less button */}
            {showReviewCount > 3 && (
              <button
                className="btn btn-primary"
                style={{ marginTop: '10px', backgroundColor:'grey', color: 'white' }}   
                onClick={() => setShowReviewCount(3)}
              >
                Show Less
              </button>
            )}
            </div>
          </div>

          {/* unlink button */}
          {auth.isAuthenticated && auth.loading === false && isLinked && 
            showUnlink && (
            <div className="grey-box-requests" style={{display:'flex', alignItems:'center'}}>
              <h1 className="normal-text" style={{fontWeight: 'bold'}}> Confirm Unlink? </h1>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <button
                  className="green-box normal-text"
                  style={{ marginLeft: "15px" }}
                  onClick={() => { 
                    unlinkPair(profile.user._id, auth.user._id);
                    setIsLinked(false);
                  }}
                >
                  ✓
                </button>
              </div>
            </div>
          )}


          {/* {auth.isAuthenticated && auth.loading === false && (
            // Chat with tutor button
            // <Link to={`/chat/${profile.user._id}`} className="btn btn-primary">
            //   Chat with tutor
            // </Link>
          )} */}

          {/* if user has sent linking request */}
          <div style={{ marginTop: '20px' }}>
            {auth.isAuthenticated && auth.loading === false && !isLinked &&
              !isRequestPending ? (
                <div>
                  <hr style={{ borderTop: '1px solid #ccc', marginBottom: '20px' }} />
                  <button className="btn btn-primary" 
                    onClick={() => {
                      console.log(profile.user._id) 
                      console.log(auth.user._id)
                      sendLinkingRequest(profile.user._id, auth.user._id);
                      setIsRequestPending(true);
                    }}>
                    Send Link Request!
                  </button>
                </div> ) : !isLinked && isRequestPending ? (
                    <div style={{ marginTop: '20px' }}>
                      <hr style={{ borderTop: '1px solid #ccc', marginBottom: '20px' }} />
                      <h1 className="normal-text">Request pending..</h1>
                    </div>
                  ) : null}
            </div>

          <div style={{ marginTop: "20px", marginBottom: "20px" }}>
            {auth.isAuthenticated && auth.loading === false && (
              <div>
                <button
                  onClick={() => {
                    onChatClick(auth.user._id, profile.user._id);
                  }}
                  className="btn btn-primary"
                >
                  Chat with tutor!
                </button>
              </div>
            )}
          </div>

          {/* rating tutor link */}
          {auth.isAuthenticated &&
            auth.loading === false &&
            isLinked &&
            !hasRated && (
              <>
                <hr style={{ borderTop: '1px solid #ccc', marginBottom: '20px' }} />
                <button
                  className="btn btn-primary"
                  onClick={toggleRatingVisibility}
                >
                  Rate Tutor!
                </button>
              </>
            )}

          {isRatingVisible && (
            <div>
              <hr style={{ borderTop: '1px solid #ccc', marginBottom: '20px' }} />
              <RateTutor
                tutorId={profile.user._id}
                findTutorById={findTutorById}
                handleRateTutor={handleRateTutor}
                auth={auth}
              />
            </div>
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
  sendLinkingRequest: PropTypes.func.isRequired,
  unlinkPair: PropTypes.func.isRequired,
  getChatID: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profiles: state.profiles,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getProfileById,
  clearProfile,
  getRegisteredProfiles,
  sendLinkingRequest,
  unlinkPair,
  getChatID,
})(Profile);
