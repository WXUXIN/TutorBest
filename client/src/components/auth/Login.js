import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";
import Spinner from "../layout/Spinner";

const Login = ({ setAlert, login, isAuthenticated, user }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  if (isAuthenticated && user && user.isTutor) {
    return <Navigate to="/TutorDashboard" />;
  } else if (isAuthenticated && user && !user.isTutor) {
    return <Navigate to="/profiles" />;
  }

  return (
    <section className="bright-overlay-bg">
      <div className="container">
        <div className="box-container">
          <h1 className="large form-font-white">Log In</h1>

          <form className="form" onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onChange}
              />
            </div>
            <input
              type="submit"
              style={{ fontFamily: "Josefin Sans" }}
              className="btn btn-primary themefont"
              value="Login"
            />
          </form>

          <p className="my-1 form-font-white">
            Don't have an account?{" "}
            <Link className="form-font-gold" to="/register">
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  user: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, { login })(Login);
