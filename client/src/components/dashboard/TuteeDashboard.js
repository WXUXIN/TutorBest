import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

const TuteeDashboard = ({ auth : {user} }) => {
    const [role, setRole] = useState('tutee');

    function handleChangeRoles(e) {
        setRole(e.target.value);
    }

    // when the user selects tutee, we will render the tutee dashboard
    // when the user selects tutor, we will render the tutor dashboard
    if (role === 'tutor' && user && user.isTutor) {
        return <Navigate to="/TutorDashboard" />;
    } else if (role === 'tutor' && user && !user.isTutor) {
        return <Navigate to="/TutorReg" />;
    }

    return (
        
        <section className="container">
            <h1>
            I am a
                <select value={role} onChange={handleChangeRoles}>
                    <option value="tutee">tutee</option>
                    <option value="tutor">tutor</option>
                </select>
            </h1>
        
            <h1>Welcome {user && user.name}</h1>
            <h1>This will be the tutee's dashboard</h1>
            {/* <h1>{user.name}'s dashdboard will go here</h1> */}
        </section>
    );
}

TuteeDashboard.propTypes = {
    auth: PropTypes.isRequired
  };

const mapStateToProps = (state) => ({
    auth: state.auth
  });

export default connect(mapStateToProps)(TuteeDashboard); 