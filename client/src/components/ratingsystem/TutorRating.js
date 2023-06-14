import React, { Component } from "react";
import PropTypes from "prop-types";
import { findCurrentTutors } from "../../actions/auth";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";

// create a vertical list of currentTutors , then once click on their name, links to the stars rating page

const TutorRating = ({ auth:{user} }) => {
    // array of tutors the tutee is in
const [currentTutors, setCurrentTutors] = useState([]);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const tutors = await findCurrentTutors(user._id);
        setCurrentTutors(tutors);
      } catch (error) {
        console.error("Error fetching current tutors:", error);
      }
    };

    fetchTutors();
  }, [user._id]);
    
      // check this part again, how are you going to pass the tutor's id into Rate

    return (
        <div>
            <h1>Your Tutors:</h1>
            {currentTutors.map((tutor) => (
                <div key={tutor._id}>
                    <h2>
                        <Link to= {`/tutor/${tutor._id}`}>{tutor.name}</Link>
                    </h2>
                </div>
            ))}
        </div>
                    
    )}


TutorRating.propTypes = {
    auth: PropTypes.isRequired

}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps)(TutorRating);
