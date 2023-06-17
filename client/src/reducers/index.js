import {combineReducers} from 'redux';
import alert from './alert';
import auth from './auth';
import profiles from './profiles';

export default combineReducers({
    // This is where we will import our reducers
    alert,
    auth,
    profiles
});