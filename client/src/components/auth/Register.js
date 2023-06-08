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
const Register = ({ setAlert, register, isAuthenticated, user }) => {
  // Every time the state changes, the component re-renders, 
  // meaning the webpage will update with the new state.
  const [formData, setMainData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const [subjects, setSubjects] = useState([]);

  const [qualification, setQualification] = useState('');

  const [otherQualification, setOtherQualification] = useState('');

  const [isTutor, setTutor] = useState(false);

  const { name, email, password, password2 } = formData;

  // Event handler
  const onChange = e =>
    setMainData({ ...formData, [e.target.name]: e.target.value });

  const emptySubjectOrPrice = () => subjects.some(subject => subject.level && (subject.subject === '' || subject.price === ''));

  const emptyQualification = () => isTutor && (qualification === '' || (qualification === 'Others' && otherQualification === ''));

  const purgeEmptySubjects = (subjs) => subjs.filter(subject => subject.subject !== '' && subject.price !== '');

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else if (emptySubjectOrPrice()) {
      setAlert('Please fill in all subject and price fields', 'danger');
    } else if (emptyQualification()) {
      setAlert('Please fill in your highest qualification', 'danger');
    } else {
      const updateList = purgeEmptySubjects(subjects);
      console.log(updateList);
      const finalQualification = qualification === 'Others' ? otherQualification : qualification;
      register({ name, email, password, isTutor, updateList,  finalQualification});
    }
  };

  // When tutor press button to add subjects they teach
  const addSubject = () => {
    const newSubject = {
      subject: '',
      level: '',
      price: '' 
    };
    setSubjects([...subjects, newSubject]);
  };

  const handleLevelChange = (index, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index].level = value;
    setSubjects(updatedSubjects);
  };

  const handleSubjectChange = (index, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index].subject = value;
    setSubjects(updatedSubjects);
  };

  const handlePriceChange = (index, value) => {
    // Remove any non-numeric characters from the input value
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    const updatedSubjects = [...subjects];
    updatedSubjects[index].price = sanitizedValue;
    setSubjects(updatedSubjects);
  };

  const removeSubject = index => {
    const updatedSubjects = [...subjects];
    updatedSubjects.splice(index, 1);
    setSubjects(updatedSubjects);
  };

  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <section className="container">
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
          <small className="form-text">
          This will be your display name
          </small>
        </div>
        
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => onChange(e)}
          />
          
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

        <div className="form-group">
        <label className="themefont" style={{ fontSize: '1.5rem' }}>

            <input
              type="checkbox"
              checked={isTutor}
              onChange={e => setTutor(!isTutor)}
            />
            <span style={{ fontFamily: 'Josefin Sans', marginLeft: '0.5rem' }}>I want to be a tutor!</span>
          </label>
          
          {isTutor ? (
            <>
              <div style={{ fontFamily: 'Josefin Sans', marginLeft: '0.5rem' }} >Select your subject(s):</div>
              {subjects.map((subject, index) => (
                <div key={index} className="form-group">
                  <div className="subject-wrapper">
                    <select
                      value={subject.level}
                      onChange={e => handleLevelChange(index, e.target.value)}
                      className="my"
                    >
                      <option value="">* Select Level of Study</option>
                      <option value="Primary School">Primary School</option>
                      <option value="Secondary School">Secondary School</option>
                      <option value="Junior College">Junior College</option>
                    </select>

                    {subject.level === "Primary School" && (
                      <select
                        value={subject.subject}
                        onChange={e => handleSubjectChange(index, e.target.value)}
                        className="my"
                      >
                        <option value="">* Select Subject</option>
                        <option value="Pri Math">Math</option>
                        <option value="Pri Science">Science</option>
                        <option value="Pri English">English</option>
                      </select>
                    )}

                    {subject.level === "Secondary School" && (
                      <select
                        value={subject.subject}
                        onChange={e => handleSubjectChange(index, e.target.value)}
                        className="my"
                      >
                        <option value="">* Select Subject</option>
                        <option value="Sec History">History</option>
                        <option value="Sec Computer Science">Computer Science</option>
                      </select>
                    )}

                    {subject.level === "Junior College" && (
                      <select
                        value={subject.subject}
                        onChange={e => handleSubjectChange(index, e.target.value)}
                        className="my"
                      >
                        <option value="">* Select Subject</option>
                        <option value="JC Subject 1">JC Subject 1</option>
                        <option value="JC Subject 2">JC Subject 2</option>
                      </select>
                    )}

                    {subject.level !== '' && subject.subject !== '' && (
                      <input
                        type="text"
                        placeholder="Price"
                        name="price"
                        value={subject.price ? `SGD ${subject.price}/hr` : `SGD`}
                        onChange={e => handlePriceChange(index, e.target.value)}
                        className="my"
                      />
                    )}

                    <button
                      type="button"
                      className="btn cross-button"
                      onClick={() => removeSubject(index)}
                    >
                      &#10005;
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn"
                onClick={addSubject}
              >
                <span>&#43;</span>
              </button>

              {/* Qualification dropdown and input box */}
              <div className="form-group">
                <div className="subject-wrapper">
                  <select
                    value={qualification}
                    onChange={e => setQualification(e.target.value)}
                    className="my"
                  >
                    <option value="">* Select your highest qualification</option>
                    <option value="Secondary School">Secondary School</option>
                    <option value="GCE A Levels">GCE A Levels</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Others">Others</option>
                  </select>

                  {qualification === "Others" && (
                    <input
                      type="text"
                      placeholder="Enter Other Qualification"
                      name="otherQualification"
                      value={otherQualification}
                      onChange={e => setOtherQualification(e.target.value)}
                      className="my"
                    />
                  )}
                </div>
              </div>
            </>
          ) : null}

        </div>
    
        <input type="submit" style={{ fontFamily: 'Josefin Sans' }} className="btn btn-primary" value="Register" />
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
  isAuthenticated: PropTypes.bool,
  user : PropTypes.object.isRequired
};


// The mapStateToProps function is used to map the user data from the Redux 
// store to the user prop of the component. It assumes that the user data is stored 
// in the auth reducer's user property. 
// Adjust the state.auth.user path according to your actual Redux store structure.
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});


// The connect function is used to connect the component to the Redux store, 
// making the user data available as a prop in the Dashboard component.

export default connect(mapStateToProps, { setAlert, register })(Register);