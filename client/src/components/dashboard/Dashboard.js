import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Dashboard = ({ auth : {user} }) => {
    return (
        <section className="container">
            <h1>Welcome {user && user.name}</h1>
            <h1>This will be the user's dashboard</h1>
            {/* <h1>{user.name}'s dashdboard will go here</h1> */}
            <h1>This is the subjects you are teaching {user && user.subjects}</h1>
        </section>
    );
}

Dashboard.propTypes = {
    auth: PropTypes.isRequired
  };

const mapStateToProps = (state) => ({
    auth: state.auth
  });

export default connect(mapStateToProps)(Dashboard); 