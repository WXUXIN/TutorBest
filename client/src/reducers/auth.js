import {REGISTER_SUCCESS, REGISTER_FAIL,
     USER_LOADED, AUTH_ERROR,
    LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT} from '../actions/types';

    // The initialState object defines the initial state of the authentication module 
    // in your Redux store. 
    // It includes properties such as token, isAuthenticated, loading, and user.

const initialState = {
    token: localStorage.getItem('token'),

    // When we make a req to register/login, we want to set isAuthenticated to true
    // used in conditionals for navbar 
    isAuthenticated: null,

    // Once we make a req to register/login, we want to set loading to false
    loading: true,
    user: null
}

// The reducer function takes 
// the state (initially set to initialState) and an action as parameters.
// The switch statement checks the action.type to determine which case to execute based on the dispatched action.

export default function(state = initialState, action) { 
    const {type, payload} = action;

    switch(type) {
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload // user data
            }
        
        // When either REGISTER_SUCCESS or LOGIN_SUCCESS action is dispatched, it 
        // updates the state by storing the token in the local storage, 
        // setting isAuthenticated to true, loading to false, 
        // and spreading the payload (which includes the token and any additional data) 
        // into the state.
        
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            // set token in local storage
            localStorage.setItem('token', payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            }

        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false
            }
        // The default case returns the current state if none of the actions match.
        default:
            return state;
    }
}

