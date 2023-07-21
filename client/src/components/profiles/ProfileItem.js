import React from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect } from "react";
import Spinner from "../layout/Spinner";
import { getChatID } from "../../actions/chatRoom";
import { connect } from "react-redux";

const ProfileItem = ({
  auth,
  profiles: { profiles, profile, loading },
  profile: {
    user,
    subjectList,
    // This is the id of the TutorInfo model
    _id,
    ratings,
  },
  subjectAndLevel,
  displayChatButton,
  getChatID,
}) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (subjectAndLevel) {
      subjectList = subjectList.filter(
        (subject) =>
          subject.subject === subjectAndLevel.varSubject &&
          subject.level === subjectAndLevel.varLevelOfStudy
      );
    }
  }, []);

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

  if (!subjectList[0]) {
    return <Spinner />;
  }

  return (
    <div
      className="profile bg-light normal-text"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <img
        style={{
          marginTop: "20px",
          borderRadius: "50%",
          width: "200px",
          height: "200px",
        }}
        src={`../../../../uploads/${user.photo || "default.jpg"}`}
      />

      <h2 className="profile-item-name">{user.name}</h2>

      {subjectAndLevel && subjectList && subjectList[0] && (
        <>
          <p style={{ margin: "0", fontSize: "20px", padding: "0" }}>
            Rate: {"  "} ${subjectList[0].price}/hr
          </p>
          <p style={{ margin: "0", fontSize: "20px", padding: "0" }}>
            {" "}
            Rating: {"  "}
            {typeof getAverageRatings(ratings) === "string"
              ? getAverageRatings(ratings)
              : `${getAverageRatings(ratings)} / 5`}
          </p>
        </>
      )}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => {
            navigate(`/profile/${_id}`);
          }}
          className="btn btn-primary"
        >
          View Profile
        </button>

        {displayChatButton && (
          <button
            onClick={() => {
              onChatClick(auth.user._id, user._id);
            }}
            className="btn btn-primary"
          >
            View Chat
          </button>
        )}
      </div>
    </div>
  );
};

ProfileItem.propTypes = {
  auth: PropTypes.object.isRequired,
  profiles: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  subjectAndLevel: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profiles: state.profiles,
  auth: state.auth,
});

export default connect(mapStateToProps, { getChatID })(ProfileItem);
