import React from 'react';
import Rating from './tutor display rating';

// pass in array of tutors
const TutorList = ({ tutorList }) => {
  return (
    <div>
      {tutorList.map((tutor) => (
        <Rating tutor={tutor} />
      ))}
    </div>
  );
};

export default TutorList;