import React, { Component } from "react";
import PropTypes from "prop-types";
import { findCurrentTutors } from "../../actions/auth";


const TutorRating = async ({ auth:{user} }) => {
    // array of tutors the tutee is in
    const currentTutors = await findCurrentTutors(user._id);

      // create a vertical list of currentTutors , then once click on their name, links to the stars rating page
    
    return (
        <div>
            <h1>Your Tutors:</h1>
            {currentTutors.map((tutor) => (
                <div key={tutor._id}>
                    <h2>{tutor.name}</h2>
                </div>
            ))};
        </div>
                    
    )}


TutorRating.propTypes = {
    auth: PropTypes.isRequired

}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps)(TutorRating);
