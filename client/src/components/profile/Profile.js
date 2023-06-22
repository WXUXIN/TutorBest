import React, { Fragment, useEffect } from "react";
import { useState } from 'react';
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getProfileById } from "../../actions/profile";
import { findCurrentTutors, makePair } from "../../actions/auth";


const Profile = ({ getProfileById, auth, profiles: { profile }, makePair }) => {
  // This gets the id from the url
  // profile id
  const { id } = useParams();

    // control state of whether the tutor and tutee is linked to render link button
    const [isLinked, setIsLinked] = useState(false);

    useEffect(() => {
      const checkTutorLink = async () => {
        try {
          const linked = await isTutorLinked();
          setIsLinked(linked);
        } catch (error) {
          console.error("Error retrieving tutors:", error);
          // Handle the error appropriately
        }
      };
  
      checkTutorLink();
    }, []);

  // useEffect hook in your code is used to fetch a profile by ID when the component mounts or when the id value changes
  useEffect(() => {
    getProfileById(id);
  }, [getProfileById, id]);

  if (profile === null) {
    return <Spinner />;
  }

  const getAverageRatings = (ratings) => {

    // Return 0 if the ratings array is empty
    if (ratings.length === 0) {
      return 0; 
    }
  
    // Calculate the sum of all ratings
    const sum = ratings.reduce((total, rating) => total + rating.rating, 0);
  
    // Calculate the average by dividing the sum by the number of ratings
    const average = sum / ratings.length;
  
    // Round the average to two decimal places
    return Math.round(average * 100) / 100;
  };

  console.log(profile);

  async function isTutorLinked() {
    try {
      const tutors = await findCurrentTutors(auth.user._id);
      const tutorIDs = tutors.map((tutor) => tutor.user._id);
      return tutorIDs.includes(profile.user._id);
    } catch (error) {
      console.error("Error retrieving tutors:", error);
      // Handle the error appropriately
    }
  }
  // function isLinked() { return isTutorLinked() };

  isTutorLinked().then((result) => {
    console.log(result);
  });
  return (
    <section className="container">
      <h1>Profile</h1>
      <Fragment>
        <h1>Tutor's name: {profile.user.name}</h1>
        <h1>Tutor's rating: {getAverageRatings(profile.ratings)} </h1>
        <h1>Tutor's email: {profile.user.email}</h1>
        <h1>Tutor's description: {profile.description}</h1>
        <h1>Tutor's subjects:</h1>
        {profile.subjectList.length > 0 ? (
          profile.subjectList.map((subject, index) => (
            <Fragment key={index}>
              <h1>Subject Name: {subject.subject}</h1>
              <h1>Level: {subject.level}</h1>
              <h1>Rate: ${subject.price}/hr</h1>
            </Fragment>
          ))
        ) : (
          <h1>No subjects</h1>
        )}
      </Fragment>

      {auth.isAuthenticated && auth.loading === false && (
        // Chat with tutor button
        <Link to={`/chat/${profile.user._id}`} className="btn btn-primary">
          Chat with tutor
        </Link>
      )}

      {/* if user is logged in */}
      <div style={{ marginTop: '20px'}}>
        
      {auth.isAuthenticated && auth.loading === false && !isLinked && (
        // Link with tutor button
        <button
          onClick={() => makePair(profile.user._id, auth.user._id)}
          style={{ border: '1px solid #000' }}
        >
          Link with tutor
        </button>
      )}
      </div>
      
      {/* rating tutor link */}
      {auth.isAuthenticated && auth.loading === false && (
        <Link to= {`/tutor/${profile.user._id}`}>Rate Tutor!</Link>
      )}
          
      {!auth.isAuthenticated && auth.loading === false && (
        // Chat with tutor button
        <Link to={`/register`} className="btn btn-primary">
          Sign up to chat!
        </Link>
      )}
    </section>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profiles: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profiles: state.profiles,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById, makePair })(Profile);
