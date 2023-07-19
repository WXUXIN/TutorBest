import React from "react";

const ReviewBox = ({ review }) => {
  return (
    <div className="yellow-box">
        <div className="user-info">
        <img
          style={{
            marginTop: "20px",
            borderRadius: "50%",
            marginRight: '15px',
            width: "60px",
            height: "60px",
          }}
            src={`../../../../uploads/${review.tutee.photo || "default.jpg"}`}
          />
          <div className="review-container">
            <div className="review-info">
                <div className="normal-text" style={{ color: "black", fontWeight: "bold", fontSize: "20px" }}>
                    {review.tutee.name}
                </div>
                <div className="normal-text rating" style={{ color: "black" }}>
                    {review.rating}/5
                </div>
            </div>
            <div className="normal-text" style={{ color: "black" }}>
                {review.comments}
            </div>
          </div>
        </div>
    </div>
  );
};

export default ReviewBox;