import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Dashboard = ({user}) => {
    return (
        <section className="container">
            <h1>Hello! {user.name}</h1>
            {/* <h1>{user.name}'s dashdboard will go here</h1> */}
        </section>
    );
}

Dashboard.propTypes = {
    user: PropTypes.object.isRequired
  };

const mapStateToProps = (state) => ({
    user: state.auth.user
  });

  export default connect(mapStateToProps)(Dashboard);