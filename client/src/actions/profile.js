import axios from "axios";
import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_PROFILES,
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
    const res = await axios.get("/api/profile");

    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

// Get profile by ID
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
    const res = await axios.get(`/api/profile/user/${user_id}`);
    console.log(res.data, "this would be the tutor progile searched by id");

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });

  } catch (err) {
    console.log(err);
  }
}
