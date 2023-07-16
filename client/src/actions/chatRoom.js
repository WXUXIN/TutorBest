import axios from "axios";
import { setAlert } from "./alert";
import { SET_LOADING } from "./types";
import setAuthToken from "../utils/set_AuthToken";

// Load User data (get user data)
// export const loadUser = () => async (dispatch) => {
//   if (localStorage.token) {
//     setAuthToken(localStorage.token);
//   }

//   try {
//     // res here is the user data
//     // this code is from the /api/auth route
//     // const user = await User.findById(req.user.id).select('-password'); // Don't return the password
//     // res.json(user);

//     const res = await axios.get("/api/auth");

//     dispatch({
//       type: USER_LOADED,
//       payload: res.data,
//     });
//   } catch (err) {
//     dispatch({
//       type: AUTH_ERROR,
//     });
//   }
// };

// Write a function to:
// 1. Check if there exist chat between tutor and tutee
// 2. If there is, redirect to the chat page
// 3. If there isn't, create a new chat between tutor and tutee
// 4. Redirect to the chat page
// This function is to be an action in chatRoom.js

// The function should return the chat room id
export const getChatID = (userID, profileID) => async (dispatch) => {
  try {
    const res = await axios.post("/api/chat", { userID, profileID });

    // res.data is the chat room id
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      console.log(errors);
    }
  }
};

export const getChatWithChatID = (ChatID) => async (dispatch) => {
    try {
      const res = await axios.get("/api/chat", {ChatID});
  
      // res.data is the chat
      return res.data;
    } catch (err) {
      const errors = err.response.data.errors;
  
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        console.log(errors);
      }
    }
  };
