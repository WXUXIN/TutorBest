import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Spinner from "../../components/layout/Spinner";
import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { findTuteeById } from "../../actions/auth";
import { getTutorProfileByUserId } from "../../actions/profile";
import {
  acceptLinkingRequest,
  rejectLinkingRequest,
} from "../../actions/linkingActions";

const TutorDashboard = ({
  auth: { user },
  profiles: { profile, loading },
  getTutorProfileByUserId,
  acceptLinkingRequest,
  rejectLinkingRequest,
}) => {
  const [role, setRole] = useState("tutor");
  const [data, setData] = useState({});
  const [settledRequests, setSettledRequests] = useState([]);

  useEffect(() => {
    if (profile && profile.linkingRequests) {
      setSettledRequests(profile.linkingRequests);
    }
  }, [profile && profile.linkingRequests]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("/api/tutorData");
        const tutorData = res.data;
        setData(tutorData);
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    if (user.isTutor) {
      getTutorProfileByUserId(user._id);
      fetchSubjects();
    }
  }, [user._id]); // Empty dependency array to ensure the effect runs only once on component mount

  function handleChangeRoles(e) {
    setRole(e.target.value);
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

  const handleAcceptRequest = async (request) => {
    await acceptLinkingRequest(profile.user._id, request.tutee);
    const updatedArray = settledRequests.filter(
      (newRequest) => newRequest.tutee !== request.tutee
    );
    console.log(updatedArray);
    setSettledRequests(updatedArray);
  };

  const handleDeclineRequest = async (request) => {
    await rejectLinkingRequest(profile.user._id, request.tutee);
    const updatedArray = settledRequests.filter(
      (newRequest) => newRequest.tutee !== request.tutee
    );
    setSettledRequests(updatedArray);
  };

  // If the user is a tutor, render the tutor dashboard when the we have retrieved the data
  // if the user is not a tutor, we will redirect them to the tutor registration page
  if (
    (Object.entries(data).length === 0 && user.isTutor) ||
    !profile ||
    loading ||
    !user
  ) {
    return <Spinner />;
  } else if (!user.isTutor) {
    return <Navigate to="/TutorReg" />;
  }

  // when the user selects tutor, we will render the tutor dashboard
  if (role === "tutee") {
    return <Navigate to="/profiles" />;
  }
  console.log(user.photo);

  const { subjectList, highestQualification, description, tutees } = data;

  console.log(subjectList);
  return (
    <section className="container">
      <div className="bright-overlay-bg"></div>
      <div className="background-image-container"></div>
      <div className="box-container">
        <h1 className="form-font-white normal-text">
          I am a
          <select
            value={role}
            onChange={handleChangeRoles}
            className="role-dropdown"
          >
            <option value="tutee">tutee</option>
            <option value="tutor">tutor</option>
          </select>
        </h1>

        <h1
          className="form-font-white normal-text"
          style={{ marginTop: "20px", fontSize: "25px" }}
        >
          {" "}
          Welcome,{" "}
          {user && (
            <span
              className="form-font-gold"
              style={{ fontWeight: "bold", fontSize: "50px" }}
            >
              {user.name}
            </span>
          )}
        </h1>

        <img
          style={{
            marginTop: "20px",
            borderRadius: "50%",
            width: "200px",
            height: "200px",
          }}
          src={`../../../../uploads/${user.photo}`}
          alt="User Avatar"
        />

        <h1
          className="form-font-white normal-text"
          style={{
            marginTop: "20px",
            fontWeight: "bold",
            fontSize: "25px",
          }}
        >
          Your Rating:
        </h1>

        <h1
          className="form-font-white normal-text"
          style={{ marginTop: "15px" }}
        >
          {typeof getAverageRatings(profile.ratings) === "string" ? (
            <h1 className="form-font-white">
              {getAverageRatings(profile.ratings)}
            </h1>
          ) : (
            <h1 className="form-font-white">
              {getAverageRatings(profile.ratings)} / 5{" "}
            </h1>
          )}
        </h1>

        <h1
          className="form-font-white normal-text"
          style={{ marginTop: "20px", fontWeight: "bold", fontSize: "25px" }}
        >
          Your Subjects:
        </h1>
        <>
          {subjectList.map((subject, index) => (
            <div
              className="normal-text form-font-white"
              style={{ marginTop: "20px" }}
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
                  Subject: {subject.subject} | Level: {subject.level} | Price:{" "}
                  {subject.price}/hr
                </li>
              </ul>
            </div>
          ))}
        </>
        <h1
          className="normal-text form-font-white"
          style={{
            marginTop: "20px",
            fontWeight: "bold",
            fontSize: "25px",
            marginBottom: "10px",
          }}
        >
          Your Description:
        </h1>
        <div className="white-box normal-text">
          {description ? description : "You have not written a description yet"}
        </div>

        <h1
          className="form-font-white normal-text"
          style={{
            fontWeight: "bold",
            fontSize: "25px",
            marginTop: "20px",
            marginBottom: "10px",
          }}
        >
          Your Highest Qualification:
        </h1>
        <div
          className="form-font-white normal-text"
          style={{ marginBottom: "20px" }}
        >
          {highestQualification}
        </div>

        <form>
          <Link to="/TutorSettings">
            <input
              type="submit"
              style={{ fontFamily: "Josefin Sans" }}
              className="btn btn-primary"
              value="Edit"
            />
          </Link>
        </form>
        
        {/* reviews display */}
        <div>
          <h3 className="form-font-white normal-text"
            style={{
              fontWeight: "bold",
              fontSize: "25px",
              marginTop: "20px",
              marginBottom: "10px",
            }}
          >
            Your Reviews:
          </h3>
          {profile.ratings.length > 0 ? (
            profile.ratings.map((review, index) => (
              <div key={index}>
                <div className="normal-text form-font-white">
                  Tutee: {review.tutee.name}
                </div>
                <div className="normal-text form-font-white">
                  Rating: {review.rating}
                </div>
                <div className="normal-text form-font-white">
                  Comments: {review.comments}
                </div>
                <hr style={{ borderColor: "grey", margin: "10px 0" }} />
              </div>
            ))
          ) : (
            <div className="normal-text form-font-white">
              No reviews yet
            </div>
            )}
        </div>  

        {/* display linkingrequests of tutor */}
        <div style={{ marginTop: "20px" }}>
          <div>
            <h3
              className="normal-text"
              style={{
                fontWeight: "bold",
                fontSize: "25px",
                marginTop: "20px",
                marginBottom: "10px",
              }}
            >
              Linking Requests
            </h3>
            {settledRequests.length > 0 ? (
              settledRequests.map((request) => (
                <div
                  style={{ marginBottom: "20px" }}
                  className="yellow-box"
                  key={request.tutee}
                >
                  {request.tuteeName}
                  <button
                    className="green-box normal-text"
                    style={{ marginLeft: "10px" }}
                    onClick={() => handleAcceptRequest(request)}
                  >
                    Accept
                  </button>
                  <button
                    className="red-box normal-text"
                    style={{ marginLeft: "10px" }}
                    onClick={() => handleDeclineRequest(request)}
                  >
                    Decline
                  </button>
                </div>
              ))
            ) : (
              <div className="normal-text" style={{ marginBottom: "20px" }}>
                {" "}
                No requests ...
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

TutorDashboard.propTypes = {
  auth: PropTypes.isRequired,
  getTutorProfileByUserId: PropTypes.func.isRequired,
  profiles: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profiles: state.profiles,
});

export default connect(mapStateToProps, {
  getTutorProfileByUserId,
  acceptLinkingRequest,
  rejectLinkingRequest,
})(TutorDashboard);
