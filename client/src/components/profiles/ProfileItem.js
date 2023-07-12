import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect } from "react";
import Spinner from "../layout/Spinner";
const ProfileItem = ({
  profile: {
    user: { name, photo },
    subjectList,
    // This is the id of the TutorInfo model
    _id,
    ratings
  },
  subjectAndLevel,
}) => {
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

  if (!subjectList[0]) {
    return <Spinner />;
  }

  return (
    <div className="profile bg-light normal-text">
      <div>
        <img
          style={{
            marginTop: "20px",
            borderRadius: "50%",
            width: "200px",
            height: "200px",
          }}
          src={`../../../../uploads/${photo || "default.jpg"}`}
        />

        <h2 style={{ fontWeight: "bold", fontSize: "30px" }}>{name}</h2>

        {/* Subject and level is to check if ProfileItem is being used in
        Profiles, RegisteredTutors or FilteredProfiles */}
        {subjectAndLevel && subjectList && subjectList[0] && (
          <>
            <p>Rate: {"  "} ${subjectList[0].price}/hr</p>
            <p> Rating: {"  "}
              {typeof getAverageRatings(ratings) === "string"
                ? getAverageRatings(ratings)
                : (`${getAverageRatings(ratings)} / 5`)} 
            </p>
          </>
        )}

        <Link to={`/profile/${_id}`} className="btn btn-primary">
          View Profile
        </Link>
      </div>
      <ul></ul>
    </div>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired,
  subjectAndLevel: PropTypes.object.isRequired,
};

export default ProfileItem;
