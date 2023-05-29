import React, { useState } from 'react';

// work with redux
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, Navigate } from 'react-router-dom';
import { SET_ALERT } from '../../actions/types';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import '../../App.css';


// Props are arugments passed from one component to another.
const Register = ({ setAlert, register, isAuthenticated }) => {
  // Every time the state changes, the component re-renders, 
  // meaning the webpage will update with the new state.
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;

  // Event handler
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      register({ name, email, password });
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <section className="container register-bg">
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user" /> Create Your Account
      </p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={onChange}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </section>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};


// The mapStateToProps function is used to map the user data from the Redux 
// store to the user prop of the component. It assumes that the user data is stored 
// in the auth reducer's user property. 
// Adjust the state.auth.user path according to your actual Redux store structure.
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});


// The connect function is used to connect the component to the Redux store, 
// making the user data available as a prop in the Dashboard component.

export default connect(mapStateToProps, { setAlert, register })(Register);