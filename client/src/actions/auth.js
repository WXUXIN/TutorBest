import axios from 'axios';
import { REGISTER_FAIL, REGISTER_SUCCESS, 
    USER_LOADED, AUTH_ERROR,
    LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from './types';
import { setAlert } from './alert';
import { SET_LOADING } from './types';
import setAuthToken from '../utils/set_AuthToken';

// Load User data (get user data)
export const loadUser = () => async (dispatch) => {

    if(localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {

        // res here is the user data
        // this code is from the /api/auth route
        // const user = await User.findById(req.user.id).select('-password'); // Don't return the password
        // res.json(user);

      const res = await axios.get('/api/auth');
  
      dispatch({
        type: USER_LOADED,
        payload: res.data
      });

    } catch (err) {
      dispatch({
        type: AUTH_ERROR
      });
    }
}

// Register User 
export const register = ({name, email, password, isTutor, subjectList, highestQualification}) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, email, password, isTutor, subjectList, highestQualification});

    try {
    // @desc    Register user
    const res = await axios.post('/api/users', body, config);
    
    // payload here is the token
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });
    
    // This is to load the user right away after registration
      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;
  
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        console.log(errors);
      }
  
      dispatch({
        type: REGISTER_FAIL
      });
    }
  };


// register as tutee as tutor
export const tutorReg = ({userID, isTutor, subjectList,  highestQualification}) => async (dispatch) => {
  console.log("tutorReg action called");
  const config = {
      headers: {
          'Content-Type': 'application/json'
      }
  }

  const body = JSON.stringify({userID, isTutor, subjectList,  highestQualification});

  try {
  // @desc    Register user
  const res = await axios.post('/api/tutorReg', body, config);
  
  // payload here is the token
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
  
  // This is to load the user right away after registration

     dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      console.log(errors);
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({email, password});

    try {
      // Authenticate user and get token (Login)  
      const res = await axios.post('/api/auth', body, config);  

      // Payload is the token   
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });

      // This is to load the user right away after login
      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;
  
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        console.log(errors);
      }
  
      dispatch({
        type: LOGIN_FAIL
      });
    }
  };


  export const setLoading = (isLoading) => (dispatch) => {
    dispatch({
      type: SET_LOADING,
      payload: isLoading
    });
  };

// Logout
export const logout = () => ({ type: LOGOUT });


