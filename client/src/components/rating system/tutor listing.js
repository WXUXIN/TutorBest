import React from 'react'
import Rating from './ratings'

const TutorRating = ({ tutor }) => {
  return (
    <div>
      <h1>{tutor.name}&nbsp;{tutor.rating} :</h1>
      <Rating value={tutor.rating} />    </div>
  );
};

export default TutorRating;