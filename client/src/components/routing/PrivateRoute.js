import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';

const PrivateRoute = ({

    // this decomposes the props object into its individual properties
    // meaning auth = { isAuthenticated : true, loading : false } for example
  component: Component,
  auth: { isAuthenticated, loading }
}) => {
  if (loading) return <Spinner />;

  // Component here is the component that is passed in as a prop to PrivateRoute
  // in App.js. 
  
  // Dashboard component will be rendered if the user is authenticated.
  if (isAuthenticated) return <Component />;

  return <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);