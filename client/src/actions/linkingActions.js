import axios from "axios";
import {
  GET_LINKING_REQUESTS,
  SEND_LINKING_REQUEST,
  ACCEPT_LINKING_REQUEST,
  REJECT_LINKING_REQUEST,
} from "./types";

// Get linking requests for a tutor
export const getLinkingRequests = (tutorId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/linking/${tutorId}/requests`);
    dispatch({
      type: GET_LINKING_REQUESTS,
      payload: res.data,
    });
  } catch (err) {
    // Handle error
  }
};

// Send a linking request from a tutee to a tutor
export const sendLinkingRequest = (tutorId) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/linking/${tutorId}/request`);
    dispatch({
      type: SEND_LINKING_REQUEST,
      payload: res.data,
    });
  } catch (err) {
    // Handle error
  }
};

// Accept a linking request by a tutor
export const acceptLinkingRequest = (tutorId, tuteeId) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/linking/${tutorId}/request/${tuteeId}/accept`);
    dispatch({
      type: ACCEPT_LINKING_REQUEST,
      payload: res.data,
    });
  } catch (err) {
    // Handle error
  }
};

// Reject a linking request by a tutor
export const rejectLinkingRequest = (tutorId, tuteeId) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/linking/${tutorId}/request/${tuteeId}/reject`);
    dispatch({
      type: REJECT_LINKING_REQUEST,
      payload: res.data,
    });
  } catch (err) {
    // Handle error
  }
};