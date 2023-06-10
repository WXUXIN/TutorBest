import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Spinner from '../../components/layout/Spinner';
import axios from 'axios';
import { setLoading }  from '../../actions/auth';
import { useEffect } from 'react';


const TutorDashboard = ({ auth : { user }}) => {

    const [role, setRole] = useState('tutor');
    const [data, setData] = useState({});
    
    useEffect(() => {

        const fetchSubjects = async () => {
          try {
            const res = await axios.get('/api/tutorData');
            const tutorData = res.data
            setData(tutorData);
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

    if (Object.entries(data).length === 0 && user.isTutor) {
        return <Spinner />;
    } else if (!user.isTutor) {
        return <Navigate to="/TutorReg" />;
    }

    // when the user selects tutor, we will render the tutor dashboard
    if (role === 'tutee') {
        return <Navigate to="/TuteeDashboard" />;
    }
    
    
    const {subjectList, highestQualification, description} = data;

    console.log(subjectList);
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
            <h1>{user.name}'s dashdboard will go here</h1>
            <h1>These are the subjects you are teaching:</h1>
            <>
                {subjectList.map((subject, index) => (
                    <div key={index}>
                        <>Subject: {subject.subject}</>
                        <>Level: {subject.level}</>
                        <>Price: {subject.price}/hr</>
                    </div>
                ))}
            </>
            <h1>Your Description</h1>
            <>
            {description ? description : "You have not written a description yet"}
            </>

            <h1>Highest Qualification</h1>
            <>
            {highestQualification}
            </>
            <form>            
                <input type="submit" style={{ fontFamily: 'Josefin Sans' }} className="btn btn-primary" value="Edit" />
            </form>
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