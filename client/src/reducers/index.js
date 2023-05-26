import {combineReducers} from 'redux';
import alert from './alert';
import auth from './auth';

export default combineReducers({
    // This is where we will import our reducers
    alert,
    auth
});