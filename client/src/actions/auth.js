import axios from "axios";
import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  RATE_TUTOR_FAILURE,
  RATE_TUTOR_SUCCESS,
  FIND_TUTOR_SUCCESS,
  FIND_TUTOR_FAILURE,
  FIND_TUTEE_SUCCESS,
  FIND_TUTEE_FAILURE,
  TUTOR_PAIR_FAILURE,
  TUTOR_PAIR_SUCCESS,
  SET_ALERT,
  REMOVE_ALERT
} from "./types";
import { setAlert } from "./alert";
import { SET_LOADING } from "./types";
import setAuthToken from "../utils/set_AuthToken";

// Load User data (get user data)
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    // res here is the user data
    // this code is from the /api/auth route
    // const user = await User.findById(req.user.id).select('-password'); // Don't return the password
    // res.json(user);

    const res = await axios.get("/api/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// // Register User
// export const register =
//   ({
//     name,
//     email,
//     password,
//     isTutor,
//     subjectList,
//     description,
//     highestQualification,
//   }) =>
//   async (dispatch) => {
//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     };

//     const body = JSON.stringify({
//       name,
//       email,
//       password,
//       isTutor,
//       subjectList,
//       description,
//       highestQualification,
//     });

//     try {
//       // @desc    Register user
//       const res = await axios.post("/api/users", body, config);

//       // payload here is the token
//       dispatch({
//         type: REGISTER_SUCCESS,
//         payload: res.data,
//       });

//       const id = Math.random().toString(36).substring(2, 9);
//       dispatch({
//         type: SET_ALERT,
//         payload: {
//           msg: "Account Successfully Registered!",
//           alertType: "success",
//           id,
//         },
//       });

//       setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), 5000);

//       //This is to load the user right away after registration
//       dispatch(loadUser());
//     } catch (err) {
//       const errors = err.response.data.errors;

//       if (errors) {
//         errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
//         console.log(errors);
//       }

//       dispatch({
//         type: REGISTER_FAIL,
//       });
//     }
//   };

// New register
export const register = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  try {
    const res = await axios.post("/api/users", formData, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    const id = Math.random().toString(36).substring(2, 9);
    dispatch({
      type: SET_ALERT,
      payload: {
        msg: "Account Successfully Registered!",
        alertType: "success",
        id,
      },
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), 5000);

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      console.log(errors);
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// register as tutee as tutor
export const tutorReg =
  ({ userID, isTutor, subjectList, description, highestQualification }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      userID,
      isTutor,
      subjectList,
      description,
      highestQualification,
    });

    try {
      // @desc    Register user
      const res = await axios.post("/api/tutorReg", body, config);

      // payload here is the token
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });

      // This is to load the user right away after registration
      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        console.log(errors);
      }

      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };

// Edit info for tutors
export const tutorSettings = ({
  userID,
  subjectList,
  highestQualification,
  description,
}) => {
  return async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      userID,
      subjectList,
      highestQualification,
      description,
    });

    try {
      const res = await axios.post("/api/tutorSettings", body, config);

      // payload here is the token
      // dispatch({
      //   type: LOGIN_SUCCESS,
      //   payload: res.data,
      // });

      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        console.log(errors);
      }

      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };
};

// Login User
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    // Authenticate user and get token (Login)
    const res = await axios.post("/api/auth", body, config);

    // Payload is the token
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    // This is to load the user right away after login
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      console.log(errors);
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

export const setLoading = (isLoading) => (dispatch) => {
  dispatch({
    type: SET_LOADING,
    payload: isLoading,
  });
};

// export const findCurrentTutors = (userID) => async  => {
//   // gives array of tutors
//   try {
//     const response = axios.get('/profile/registeredTutors/${userID}', {
//       // pass the userID of the tutee to the router
//       params: {
//         userID: userID
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error retrieving tutors:', error);
//     // Handle the error appropriately
//     throw error;
//   }
// };

// passes in the tutor's USER id in the tutor's user model and the new rating that you want to add
export const handleRateTutor =
  (tutorId, rating, comments, tuteeId) => async (dispatch) => {
    try {
      console.log("Sending rate tutor request:", tutorId, rating, tuteeId);
      const response = await axios.post("/api/rate-tutor", {
        tutorId: tutorId,
        rating: rating,
        comments: comments,
        tuteeId: tuteeId,
      });
      dispatch({
        type: RATE_TUTOR_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: RATE_TUTOR_FAILURE,
        payload: error.response.data,
      });
      throw error;
    }
  };

// passes in the tutor's USER id in the tutor's user model
export const findTutorById = (tutorId) => async (dispatch) => {
  try {
    const response = await axios.get("/api/fetchOneTutor", {
      params: {
        tutorId: tutorId,
      },
    });
    dispatch({
      type: FIND_TUTOR_SUCCESS,
      payload: response.data,
    });

    // response contains tutor's user model and tutor's ratings
    return response.data;
  } catch (error) {
    dispatch({
      type: FIND_TUTOR_FAILURE,
      payload: error.response.data,
    });
    throw error;
  }
};

// passes in the tutee's USER id in the tutor's user model
export const findTuteeById = (tuteeId) => async(dispatch) => {
  try {
    console.log(tuteeId)
    const response = await axios.get('/api/fetchTutee', {
      params: {
        tuteeId: tuteeId
      }
  });
  dispatch({
    type: FIND_TUTEE_SUCCESS,
    payload: response.data,
  });
  // response contains tutee's user model and tutee's ratings
  return response.data;
  } catch (error) {
    dispatch({
      type: FIND_TUTEE_FAILURE,
      payload: error.response.data,
    });
    throw error;
  }
}

// Logout
export const logout = () => ({ type: LOGOUT });

// making tutor-tutee pair
export const makePair = (tutorId, tuteeId) => async (dispatch) => {
  console.log("makePair function called");

  try {
    const response = await axios.post("/api/updatePair", {
      tutorId: tutorId,
      tuteeId: tuteeId,
    });
    dispatch({
      type: TUTOR_PAIR_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: TUTOR_PAIR_FAILURE,
      payload: error.response.data,
    });
    throw error;
  }
};
