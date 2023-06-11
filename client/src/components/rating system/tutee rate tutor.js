import React from 'react'
import Stars from './stars rating function'

const TutorRating = ({ tutor }) => {
  return (
    <div>
      <h1>{tutor.name} :</h1>
      <Stars initialRating= "0"/>  
      <button>Rate tutor</button>  
    </div>
  );
};

export default TutorRating;