import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Spinner from '../../components/layout/Spinner';
import axios from 'axios';
import { setLoading }  from '../../actions/auth';
import { useEffect } from 'react';


const TutorDashboard = ({ auth : { user, loading }, setLoading }) => {

    const [role, setRole] = useState('tutor');
    const [subjects, setSubjects] = useState([]);
    
    useEffect(() => {

        const fetchSubjects = async () => {
          try {
            const res = await axios.get('/api/subjectList');
            const subjectList = res.data.subjectList;
            setSubjects(subjectList);
          } catch (error) {
            console.error(error);
            // Handle error
          } 
        };
      
        fetchSubjects();
      }, []); // Empty dependency array to ensure the effect runs only once on component mount
      

    function handleChangeRoles(e) {
        setRole(e.target.value);
    }

    if (subjects.length === 0 && user.isTutor) {
        return <Spinner />;
    } else if (!user.isTutor) {
        return <Navigate to="/TutorReg" />;
    }

    // when the user selects tutor, we will render the tutor dashboard
    if (role === 'tutee') {
        return <Navigate to="/TuteeDashboard" />;
    } 

    console.log(subjects);
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
            <h1>This will be the Tutor's dashboard</h1>
            {/* <h1>{user.name}'s dashdboard will go here</h1> */}
            <h1>These are the subjects you are teaching:</h1>
            <>
                {subjects.map((subject, index) => (
                    <div key={index}>
                        <h1>Subject: {subject.subject}</h1>
                        <h1>Level: {subject.level}</h1>
                        <h1>Price: {subject.price}/hr</h1>
                    </div>
                ))}

            </>

        </section>
    );
}

TutorDashboard.propTypes = {
    auth: PropTypes.isRequired,
    setLoading: PropTypes.func.isRequired
  };

const mapStateToProps = (state) => ({
    auth: state.auth
  });

export default connect(mapStateToProps, {setLoading})(TutorDashboard); 