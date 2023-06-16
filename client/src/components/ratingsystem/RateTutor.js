import React, { Component } from "react";
import { useState } from 'react';
import PropTypes from "prop-types";
import { findTutorById, handleRateTutor } from "../../actions/auth";
import { useParams } from 'react-router-dom';
import { connect } from "react-redux";
import { useEffect } from "react";


// page where tutees can rate their tutor
const RatingTutor = ({ findTutorById, handleRateTutor, auth:{user} }) => {

    // fetching the tutorId from the url. refers to USER ID of tutor in the user model of the tutor's model
    const { tutorId } = useParams();

    const [tutor, setTutor] = useState(null);

    const [rating, setRating] = useState(0);


    useEffect(() => {
        const fetchTutor = async () => {
          try {

            // contains tutor's user model
            const fetchedTutor = await findTutorById(tutorId);
            setTutor(fetchedTutor);

          } catch (error) {
            console.error('Error fetching tutor:', error);
          }
        };
    
        fetchTutor();
      }, [findTutorById, tutorId]);

    console.log(tutor);
    
    // star clicking function for rating tutors 
    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    //how a tutee rates tutor page (click stars)
    const Stars = ({ initialRating }) => {
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

    // pass in the fields needed to update tutor rating, tutor's user id, rating and the tutee's user id
    const rateTutor = () => {
        handleRateTutor(tutorId, rating, user._id);
    };

    // Display a loading state until the tutor data is fetched, or not when theres no tutor(tutor = null) system cant run
    if (!tutor) {
      return <div>
            <h1>Loading tutor...</h1>
          </div>
    }

    return (
        <div style={{marginTop: '120px'}}>
            <h1>{tutor.user.name}</h1>
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