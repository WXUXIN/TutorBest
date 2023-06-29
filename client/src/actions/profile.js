import axios from "axios";
import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_PROFILES,
  GET_FILTERED_PROFILES,
  GET_REGISTERED_PROFILES,
  CLEAR_PROFILES,
  GET_REPOS,
  NO_REPOS,
} from "./types";

import { setAlert } from "./alert";

// This allows us to get the current user's profile
// and store it in the state
export const getAllProfiles = () => async (dispatch) => {
  try {
    // this returns a list of objects
    // 0:
    // description: ""
    // highestQualification: "Primary School"
    // ratings: []
    // subjectList: []
    // tutees: []
    // user:
    //   avatar: "//www.gravatar.com/avatar/9e0105384b2855624baed0f800b7b3c1?s=200&r=pg&d=mm"
    //   date: "2023-06-08T17:10:49.277Z"
    //   email: "asdasd@asdadsasdasd"
    //   isTutor: true
    //   name
    //   : "aasdasd"
    //   password: "$2a$10$06vDjFYi1K157LRrckwMZubBjEqP5PgFUgnqiT4bpAnKnyVI.EXEu"
    //   __v: 0
    //   _id: "64820b99866cb70681a7892d"
    //   [[Prototype]]: Object
    // __v: 0
    // _id: "64820b99866cb70681a7892f"

    // Makes sure to clear all the profiles in the state, and set
    // loading to true
    
    dispatch({
      type: CLEAR_PROFILES,
    });

    dispatch({
      type: CLEAR_PROFILE,
    });

    
    const res = await axios.get("/api/profile");

    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

// Get profile by tutor ID
export const getProfileById = (user_id) => async (dispatch) => {
  try {
    // this returns a list of objects
    // 0:
    // description: ""
    // highestQualification: "Primary School"
    // ratings: []
    // subjectList: []
    // tutees: []
    // user:
    //   avatar: "//www.gravatar.com/avatar/9e0105384b2855624baed0f800b7b3c1?s=200&r=pg&d=mm"
    //   date: "2023-06-08T17:10:49.277Z"
    //   email: "asdasd@asdadsasdasd"
    //   isTutor: true
    //   name
    //   : "aasdasd"
    //   password: "$2a$10$06vDjFYi1K157LRrckwMZubBjEqP5PgFUgnqiT4bpAnKnyVI.EXEu"
    //   __v: 0
    //   _id: "64820b99866cb70681a7892d"
    //   [[Prototype]]: Object
    // __v: 0
    // _id: "64820b99866cb70681a7892f"
    
    dispatch({
      type: CLEAR_PROFILE,
    });

    console.log("running getProfileById action")
    const res = await axios.get(`/api/profile/user/${user_id}`);
    console.log(res.data, "this would be the tutor profile searched by id");

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};


// Get profile by tutor ID
export const getTutorProfileByUserId = (user_id) => async (dispatch) => {
  try {
  
    dispatch({
      type: CLEAR_PROFILE,
    });

    console.log("running getProfileById action")
    const res = await axios.get(`/api/profile/tutorInfoByUserId/${user_id}`);
    console.log(res.data, "this would be the tutor profile searched by id");

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};


export const getFilteredProfiles =
  (levelOfStudy, subject) => async (dispatch) => {
    try {
      dispatch({
        type: CLEAR_PROFILE,
      });

      const res = await axios.get(
        `/api/profile/filter?levelOfStudy=${levelOfStudy}&subject=${subject}`
      );
      console.log(res.data, "filtered data list"); // The filtered profiles based on the levelOfStudy and subject

      dispatch({
        type: GET_FILTERED_PROFILES,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };


// Update redux state of all tutee's registered tutors using user_id 
export const getRegisteredProfiles = (user_id) => async (dispatch) => {
  try {
    dispatch({
      type: CLEAR_PROFILES,
    });

    console.log("getting the registered profiles");
    const res = await axios.get(`/api/profile/registeredTutors/${user_id}`);

    dispatch({
      type: GET_REGISTERED_PROFILES,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const clearProfiles = () => async (dispatch) => {
  // I need to clear the profiles in the state
  dispatch({
    type: CLEAR_PROFILES,
  });
};

export const clearProfile = () => async (dispatch) => {
  // I need to clear the profiles in the state
  dispatch({
    type: CLEAR_PROFILE,
  });
};
