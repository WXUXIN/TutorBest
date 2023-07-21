import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_PROFILES,
  CLEAR_PROFILES,
  GET_FILTERED_PROFILES,
  GET_REGISTERED_PROFILES,
  GET_CURRENT_CHAT_PROFILES
} from "../actions/types";

const initialState = {
  profile: null,
  profiles: [],
  loading: true,
  error: {},
};

function profileReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case GET_PROFILES:
    case GET_FILTERED_PROFILES:
    case GET_REGISTERED_PROFILES:
    case GET_CURRENT_CHAT_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        profile: null,
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        loading: true
      };
    case CLEAR_PROFILES:
        return {
            ...state,
            profiles: [],
            loading: true
        }
    default:
      return state;
  }
}

export default profileReducer;
