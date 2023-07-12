import axios from "axios";
import {
  GET_LINKING_REQUESTS,
  GET_LINKING_REQUESTS_FAIL,
  SEND_LINKING_REQUEST,
  SEND_LINKING_REQUEST_FAIL,
  ACCEPT_LINKING_REQUEST,
  ACCEPT_LINKING_REQUEST_FAIL,
  REJECT_LINKING_REQUEST,
  REJECT_LINKING_REQUEST_FAIL,
} from "./types";

// Get linking requests for a tutor
export const getLinkingRequests = (tutorId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/linkingRoutes/${tutorId}/requests`);
    dispatch({
      type: GET_LINKING_REQUESTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
        type: GET_LINKING_REQUESTS_FAIL,
        payload: err.response.data,
      });  
      throw err
    }
  };

// Send a linking request from a tutee to a tutor
export const sendLinkingRequest = (tutorId, tuteeId) => async (dispatch) => {
  try {
    console.log(`/api/linkingRoutes/${tutorId}/request/${tuteeId}`)
    const res = await axios.post(`/api/linkingRoutes/${tutorId}/request/${tuteeId}`);
    console.log('done');
    dispatch({
      type: SEND_LINKING_REQUEST,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
        type: SEND_LINKING_REQUEST_FAIL,
        payload: err.response.data,
      });  
      throw err
  }
};

// Accept a linking request by a tutor
export const acceptLinkingRequest = (tutorId, tuteeId) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/linkingRoutes/${tutorId}/request/${tuteeId}/accept`);
    dispatch({
      type: ACCEPT_LINKING_REQUEST,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
        type: ACCEPT_LINKING_REQUEST_FAIL,
        payload: err.response.data,
      });  
      throw err
  }
};

// Reject a linking request by a tutor
export const rejectLinkingRequest = (tutorId, tuteeId) => async (dispatch) => {
  try {
    console.log(`/api/linkingRoutes/${tutorId}/request/${tuteeId}/reject`);
    const res = await axios.post(`/api/linkingRoutes/${tutorId}/request/${tuteeId}/reject`);
    dispatch({
      type: REJECT_LINKING_REQUEST,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
        type: REJECT_LINKING_REQUEST_FAIL,
        payload: err.response.data,
      });  
      throw err
  }
};