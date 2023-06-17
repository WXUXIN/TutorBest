import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getProfileById } from "../../actions/profile";

const Profile = ({ getProfileById, auth, profiles: { profile } }) => {
  // This gets the id from the url
  const { id } = useParams();

  useEffect(() => {
    getProfileById(id);
  }, [getProfileById, id]);

  if (profile === null) {
    return <Spinner />;
  }

  return (
    <section className="container">
      <h1>Profile</h1>
      <Fragment>
        <h1>Tutor's name: {profile.user.name}</h1>
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

export default connect(mapStateToProps, { getProfileById })(Profile);
