import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProfileItem = ({
  profile: {
    user: { name },
    subjectList,
    // This is the id of the TutorInfo model
    _id
  }
}) => {
  return (
    <div className='profile bg-light normal-text'>
      <div>
        <h2>{name}</h2>
        
        <Link to={`/profile/${_id}`} className='btn btn-primary'>
          View Profile
        </Link>
      </div>
      <ul>
        
      </ul>
    </div>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;