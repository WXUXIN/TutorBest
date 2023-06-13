import React from 'react'
import Stars from './stars rating function'
import axios from 'axios';

// find and connect how the tutor is going to get passed in
const TutorRating = ({ tutor }) => {
  
  const handleRateTutor = async () => {
    try {
      const response = await axios.post('/api/rate-tutor', {
        tutorId: tutor.id, // passed in tutor's ID
        rating: tutor.rating // passed in tutor's rating
      });

    } catch {
        console.error("Error rating tutor");
    }
  }
  
  return (
    <div>
      <h1>{tutor.id} :</h1>
      <Stars initialRating= "0"/>  
      <button onClick={handleRateTutor}>Rate tutor</button>  
    </div>
  );
};

export default TutorRating;