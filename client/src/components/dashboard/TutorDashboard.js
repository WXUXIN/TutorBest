import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Spinner from '../../components/layout/Spinner';
import axios from 'axios';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

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

    // If the user is a tutor, render the tutor dashboard when the we have retrieved the data
    // if the user is not a tutor, we will redirect them to the tutor registration page
    if (Object.entries(data).length === 0 && user.isTutor) {
        return <Spinner />;
    } else if (!user.isTutor) {
        return <Navigate to="/TutorReg" />;
    }

    // when the user selects tutor, we will render the tutor dashboard
    if (role === 'tutee') {
        return <Navigate to="/profiles" />;
    }    
    
    const {subjectList, highestQualification, description, tutees} = data;

    console.log(subjectList);
    return (
        <section className="container">
          <div className="dark-overlay-bg"></div>
          <div className="background-image-container"></div>
            <div className="box-container">
              <h1 className="normal-text">
                I am a
                    <select value={role} onChange={handleChangeRoles} className="role-dropdown">
                        <option value="tutee">tutee</option>
                        <option value="tutor">tutor</option>
                    </select>
                </h1>
                
                <h1 className="normal-text" style={{ marginTop: "20px" }}> Welcome {user && <span style={{ fontWeight: 'bold', fontSize: "25px" }}>{user.name}</span>}
</h1>
                <h1 className="normal-text" style={{ marginTop:"20px"}}>This will be the Tutor's dashboard</h1>
                <h1 className="normal-text" style={{ marginTop:"20px"}}>These are the subjects you are teaching:</h1>
                <>
                    {subjectList.map((subject, index) => (
                        <div className="normal-text" style={{ marginTop:"20px"}} key={index}>
                          <ul style={{ listStyleType: "disc", marginLeft: "20px", marginBottom: "10px" }}>
                          <li>
                            Subject: {subject.subject} | Level: {subject.level} | Price: {subject.price}/hr
                          </li>
                          </ul>
                        </div>
                    ))}
                </>
                <h1 className="normal-text" style={{ marginTop:"20px"}}>Your Description</h1>
                <>
                {description ? description : "You have not written a description yet"}
                </>

                <h1 className="normal-text" style={{ marginTop:"20px"}}>Highest Qualification</h1>
                <>
                {highestQualification}
                </>

                <form>
                <Link to="/TutorSettings">            
                    <input type="submit" style={{ fontFamily: 'Josefin Sans' }} className="btn btn-primary" value="Edit" />
                </Link>
                </form>
              </div>
        </section>
    );
}

TutorDashboard.propTypes = {
    auth: PropTypes.isRequired
  };

const mapStateToProps = (state) => ({
    auth: state.auth
  });

export default connect(mapStateToProps)(TutorDashboard); 