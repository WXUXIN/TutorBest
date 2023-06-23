import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getAllProfiles, getFilteredProfiles, clearProfiles } from "../../actions/profile";
import { Navigate, useNavigate } from "react-router-dom";
import ProfileItem from "./ProfileItem";
import {
  subjectOptionsData,
  levelOfStudyTemplate,
} from "../../subjectOptionsData";

const FilteredProfiles = ({
  auth: { user, isAuthenticated },
  profiles,
  getFilteredProfiles,
  clearProfiles,
}) => {
  // Gets the level of study and subject from the url

  const [role, setRole] = useState("tutee");

  const [profilesList, setProfiles] = useState([]);

  // This stores the selection of the level of study
  const [levelOfStudy, setLevelOfStudy] = useState("");

  // This stores the subject selected by tutee
  const [subject, setSubject] = useState("");

  const navigate = useNavigate();

  // This stores the subjects that can be selected from the dropdown
  const [subjectOptions, setSubjectOptions] = useState([]);

  const [sortBy, setSortBy] = useState("");

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const varLevelOfStudy = queryParams.get("levelOfStudy");
  const varSubject = queryParams.get("subject");
  const subjectAndLevel = { varSubject, varLevelOfStudy };

  // For students to select their level of study
  const handleLevelOfStudyChange = (e) => {
    const selectedLevelOfStudy = e.target.value;
    setLevelOfStudy(selectedLevelOfStudy);

    // Update subject options based on the selected level of study
    if (selectedLevelOfStudy in subjectOptionsData) {
      setSubjectOptions(subjectOptionsData[selectedLevelOfStudy]);
    } else {
      setSubjectOptions([]);
    }

    // Reset the selected subject every time the level of study is changed
    setSubject("");
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  // Calls the getFilteredProfiles action once to get the
  // latest filtered list of profiles from the database
  useEffect(() => {
    

    const queryParams = new URLSearchParams(location.search);
    const varLevelOfStudy = queryParams.get("levelOfStudy");
    const varSubject = queryParams.get("subject");

    setLevelOfStudy(varLevelOfStudy)
    setSubject(varSubject)

    setSubjectOptions(subjectOptionsData[varLevelOfStudy]);

    console.log("useEffect called for filtered profiles");

    // This will call the getFilteredProfiles action
    // to store all the profiles in the redux store
    getFilteredProfiles(varLevelOfStudy, varSubject);

    // React wil; re-run the effect whenever the location.search value changes.
    // This allows us to track changes in the query string parameters of the URL.
    // location.search property specifically represents the query string portion of the URL
  }, [location.search, getFilteredProfiles]);

  //   Updates the profilesList state variable
  //   Rerun when the profiles state variable is updated
  useEffect(() => {
    setProfiles(profiles.profiles);
  }, [profiles.profiles]);

  function handleChangeRoles(e) {
    setRole(e.target.value);
  }

  if (isAuthenticated) {
    // when the user selects tutee, we will render the tutee dashboard
    if (role === "tutor" && user && user.isTutor) {
      return <Navigate to="/TutorDashboard" />;
    } else if (role === "tutor" && user && !user.isTutor) {
      return <Navigate to="/TutorReg" />;
    }
  }

  const getSubjectPrice = (profile) => {
    const subject = profile.subjectList.find(
      (subj) => subj.subject === varSubject && subj.level === varLevelOfStudy
    );
    return subject ? subject.price : null;
  };

  const sortProfiles = (profiles, sortBy) => {
    const sortedProfiles = [...profiles];
    console.log(sortBy, sortedProfiles);

    switch (sortBy) {
      case "Pricing - Low to High":
        sortedProfiles.sort((a, b) => {
          const priceA = getSubjectPrice(a);
          const priceB = getSubjectPrice(b);

          console.log(priceA, priceB);

          if (priceA !== null && priceB !== null) {
            return priceA - priceB;
          } else if (priceA !== null) {
            return -1; // 'a' has a defined price, so it should come before 'b'
          } else if (priceB !== null) {
            return 1; // 'b' has a defined price, so it should come before 'a'
          } else {
            return 0; // Both 'a' and 'b' don't have a defined price, so their order remains unchanged
          }
        });
        break;
      case "Pricing - High to Low":
        sortedProfiles.sort((a, b) => {
          const priceA = getSubjectPrice(a);
          const priceB = getSubjectPrice(b);

          if (priceA !== null && priceB !== null) {
            return priceB - priceA;
          } else if (priceA !== null) {
            return -1; // 'a' has a defined price, so it should come before 'b'
          } else if (priceB !== null) {
            return 1; // 'b' has a defined price, so it should come before 'a'
          } else {
            return 0; // Both 'a' and 'b' don't have a defined price, so their order remains unchanged
          }
        });
        break;
      // Add more cases for other sorting options if needed
      default:
        break;
    }

    console.log("sorted", sortedProfiles);

    setProfiles(sortedProfiles);
  };

  //   If still setting data in profilesList, show spinner
  if (profiles.loading) {
    return <Spinner />;
  }

  const handleSearch = () => {
    if (levelOfStudy && subject) {
      // i need to clear the redux store of the profiles
      // so that the next filtered profiles
      // can be stored in the redux store
      clearProfiles();
      navigate(
        `/filtered-profiles?levelOfStudy=${levelOfStudy}&subject=${subject}`
      );
    }
  };

  // I want to now filter the list of tutors based on the level of study and subject that
  // the student has selected
  return (
    <section className="dark-overlay-bg">
    <div className="background-image-container"></div>
    
    <div className="container">
      <div className="box-container">
      {isAuthenticated && (
        <h1 className="normal-text" style={{ position: "absolute", top: "10px" }}>
          I am a
          <select className="role-dropdown" value={role} onChange={handleChangeRoles}>
            <option value="tutee">tutee</option>
            <option value="tutor">tutor</option>
          </select>
        </h1>
      )}
            
      <div style={{ marginTop: "20px" }}>
        <select
          value={levelOfStudy}
          onChange={handleLevelOfStudyChange}
          className="dropdown normal-text"
          style={{
            fontSize: "inherit",
            backgroundColor: "grey",
            color: "#e9c78c",
            borderRadius: "30px",
            textAlign: "center",
            padding: "8px",
            width: "200px",
            float: "left",
            marginRight: "10px"
          }}
        >
          <option value="">Level of Study</option>
          {levelOfStudyTemplate.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={subject}
          onChange={handleSubjectChange}
          className="dropdown normal-text"
          style={{
            fontSize: "inherit",
            backgroundColor: "grey",
            color: "#e9c78c",
            borderRadius: "30px",
            textAlign: "center",
            padding: "8px",
            width: "200px",
            float: "left",
          }}
          disabled={subjectOptions.length === 0}
        >
          {subjectOptions.length === 0 ? (
            <option value="">Select level of study</option>
          ) : (
            <>
              <option value="">Select subject</option>
              {subjectOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </>
          )}
        </select>
      

      <button
        className="btn btn-primary"
        disabled={!levelOfStudy || !subject}
        onClick={handleSearch}
        style={{
          textAlign: "center",
          borderRadius: "30px",
          marginLeft: "30px"
        }}
      >
        Search for tutors
      </button>

      <select
        value={sortBy}
        onChange={(e) => {
          sortProfiles(profilesList, e.target.value);
          setSortBy(e.target.value);
        }}
        className="dropdown normal-text"
        style={{
          fontSize: "inherit",
          backgroundColor: "grey",
          color: "#e9c78c",
          borderRadius: "30px",
          textAlign: "center",
          padding: "8px",
          marginLeft: "60px"

        }}
      >
        <option disabled value="">
          Sort By
        </option>
        <option value="Pricing - Low to High">Pricing - Low to High</option>
        <option value="Pricing - High to Low">Pricing - High to Low</option>
      </select>
      </div>
      
      <div style={{ marginTop: '10px' }}>
      {profilesList.length > 0 ? (
        <Fragment>
          {profilesList.map((profile) => (
            <ProfileItem key={profile._id} profile={profile} subjectAndLevel = {subjectAndLevel} />
          ))}
        </Fragment>
      ) : (
        <h4>No profiles found...</h4>
      )}
      </div>
    
        </div>
    </div>
    </section>
    
  );
};

FilteredProfiles.propTypes = {
  auth: PropTypes.isRequired,
  getAllProfiles: PropTypes.func.isRequired,
  getFilteredProfiles: PropTypes.func.isRequired,
  clearProfiles: PropTypes.func.isRequired,
  profiles: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profiles: state.profiles,
});

export default connect(mapStateToProps, { getFilteredProfiles, clearProfiles })(
  FilteredProfiles
);
