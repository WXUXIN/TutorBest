import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { tutorReg } from '../../actions/auth';

const TutorReg = ({ auth : {user} }) => {

    const [subjects, setSubjects] = useState([]);

    const [qualification, setQualification] = useState('');

    const [otherQualification, setOtherQualification] = useState('');

    // Event handler

    const emptySubjectOrPrice = () => subjects.some(subject => subject.level && (subject.subject === '' || subject.price === ''));

    const emptyQualification = () => qualification === '' || (qualification === 'Others' && otherQualification === '');

    const purgeEmptySubjects = (subjs) => subjs.filter(subject => subject.subject !== '' && subject.price !== '');

    const onSubmit = async e => {
    e.preventDefault();
    if (emptySubjectOrPrice()) {
        setAlert('Please fill in all subject and price fields', 'danger');
    } else if (emptyQualification()) {
        setAlert('Please fill in your highest qualification', 'danger');
    } else {
        const subjectList = purgeEmptySubjects(subjects);
        const highestQualification = qualification === 'Others' ? otherQualification : qualification;
        const isTutor = true;
        const userID = user._id;
        tutorReg({userID, isTutor, subjectList,  highestQualification});
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

    if (user.isTutor) {
        return <Navigate to="/TutorDashboard" />;
    }

    return (
        <section className="container">
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
              </section>

    )
}

TutorReg.propTypes = {
    auth: PropTypes.isRequired
  };

const mapStateToProps = (state) => ({
    auth: state.auth
  });

export default connect(mapStateToProps)(TutorReg);