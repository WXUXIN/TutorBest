import React, { Component } from "react";
import { useState } from 'react';
import PropTypes from "prop-types";
import { handleRateTutor } from "../../actions/auth";

// page where tutees can rate their tutor
const RatingTutor = async ({ auth:{user} }) => {

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
    )}  
    
    return (
        <div>
            <h1>{tutor.name} :</h1>
                <Stars initialRating= "0"/>  
                <button onClick={handleRateTutor}>Rate tutor</button>  
        </div>
    )}

RatingTutor.propTypes = {
    auth: PropTypes.isRequired
}
    
const mapStateToProps = (state) => ({
    auth: state.auth
})
    
export default connect(mapStateToProps)(RatingTutor); 