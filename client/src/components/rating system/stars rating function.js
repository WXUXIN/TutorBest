import React, { useState } from 'react';

const Stars = ({ initialRating }) => {
  const [rating, setRating] = useState(initialRating);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  //how a tutee rates tutor page (click stars)
  return (
    <div>
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          onClick={() => handleRatingChange(index + 1)}
          style={{ cursor: 'pointer', color: index < rating ? 'gold' : 'gray' }}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
};


export default Stars;