import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect } from "react";
import Spinner from "../layout/Spinner";
const ProfileItem = ({
  profile: {
    user: { name },
    subjectList,
    // This is the id of the TutorInfo model
    _id,
    ratings
  },
  subjectAndLevel,
}) => {
  console.log(subjectAndLevel);

  useEffect(() => {
    if (subjectAndLevel) {
      subjectList = subjectList.filter(
        (subject) =>
          subject.subject === subjectAndLevel.varSubject &&
          subject.level === subjectAndLevel.varLevelOfStudy
      );
    }
  }, []);

  console.log(subjectList);

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
    const roundedAverage = Math.round(average * 100) / 100;

    return `${roundedAverage}/5`; // Append '/5' to the average rating
  };

  if (!subjectList[0]) {
    return <Spinner />
  }

  return (
    <div className='profile bg-light normal-text'>
      <div>
        <h2 style = {{ fontWeight: "bold", fontSize: "30px" }}>{name}</h2>
        <div style={{ marginBottom: '5px' }}>
        <p>
          {ratings.length > 0
            ? `Average Rating: ${getAverageRatings(ratings)}`
            : "No ratings yet.."}
        </p>        
      </div>

        {/* Subject and level is to check if ProfileItem is being used in
        Profiles, RegisteredTutors or FilteredProfiles */}
        {subjectAndLevel && subjectList && subjectList[0] && <p>${subjectList[0].price}/hr</p>}

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
