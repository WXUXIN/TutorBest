import {
    GET_LINKING_REQUESTS,
    SEND_LINKING_REQUEST,
    ACCEPT_LINKING_REQUEST,
    REJECT_LINKING_REQUEST,
  } from "../actions/types";
  
  const initialState = {
    linkingRequests: [],
  };
  
  export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_LINKING_REQUESTS:
        return {
          ...state,
          linkingRequests: payload,
        };
      case SEND_LINKING_REQUEST:
        return {
          ...state,
          linkingRequests: [...state.linkingRequests, payload],
        };
      case ACCEPT_LINKING_REQUEST:
      case REJECT_LINKING_REQUEST:
        return {
          ...state,
          linkingRequests: state.linkingRequests.map((request) =>
            request._id === payload._id ? payload : request
          ),
        };
      default:
        return state;
    }
  }