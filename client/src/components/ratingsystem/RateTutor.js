import React, { Component } from "react";
import { useState } from 'react';
import PropTypes from "prop-types";
import { findTutorById, handleRateTutor } from "../../actions/auth";
import { useParams } from 'react-router-dom';
import { connect } from "react-redux";
import { useEffect } from "react";


// page where tutees can rate their tutor
const RatingTutor = ({ findTutorById, handleRateTutor, auth }) => {

    // fetching the tutorId from the url
    const { tutorId } = useParams();

    const [tutor, setTutor] = useState(null);

    const [rating, setRating] = useState(0);


    useEffect(() => {
        const fetchTutor = async () => {
          try {
            const fetchedTutor = await findTutorById(tutorId);
            setTutor(fetchedTutor);
          } catch (error) {
            console.error('Error fetching tutor:', error);
          }
        };
    
        fetchTutor();
      }, [findTutorById, tutorId]);
    

    //how a tutee rates tutor page (click stars)
    const Stars = ({ initialRating, handleRatingChange }) => {
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

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const rateTutor = () => {
        handleRateTutor(tutorId, rating);
    };

    return (
        <div>
            <h1>{tutor.name}</h1>
            <Stars initialRating= "0"/>  
            <button onClick={rateTutor}>Rate tutor</button>        
        </div>
    )}

    
    // propTypes object is used for type checking and validation of the props passed to the component.
    RatingTutor.propTypes = {
        findTutorById: PropTypes.func.isRequired,
        handleRateTutor: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired
      };
      
      const mapStateToProps = (state) => ({
        auth: state.auth
      });
      
      export default connect(mapStateToProps, { findTutorById, handleRateTutor })(RatingTutor);