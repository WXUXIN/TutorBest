import './App.css';
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';
import React, { Fragment, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login'; 
import TutorDashboard from './components/dashboard/TutorDashboard'; 
import TuteeDashboard from './components/dashboard/TuteeDashboard';
import TutorReg from './components/dashboard/TutorReg';
import Alert from './components/layout/Alert';
import { loadUser } from './actions/auth';
//Redux
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utils/set_AuthToken';
import PrivateRoute from './components/routing/PrivateRoute';
import NotFound from './components/layout/NotFound';
import TutorSettings from './components/dashboard/TutorSettings';


import './App.css';
import RateTutor from './components/ratingsystem/RateTutor';

if(localStorage.token) {
  setAuthToken(localStorage.token);
}

// The app component is the main component that will be rendered in the index.js file.
// Look at useEffect hook. This will run once when react renders the component.
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    // The provided code represents the App component in a React application. 
    // It sets up the routing and renders different components based on the specified routes. 
    // The below code will be placed inside the App component which will be rendered in the index.js file
    // which  will be rendered in the root element of the HTML file.

    // Provider allows the app to access the redux store.
  <Provider store={store}>
    <Router>
          <div className="app-container">
          <Navbar /></div>
          <div className="content-wrapper">
            <Alert /></div>
        <Routes>
          {/* Depending on which route the user types in, we will render the Landing,  */}
          <Route path='/' element={<Landing />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/login' element={<Login />}/>
          <Route
            path="/TutorDashboard"
            element={<PrivateRoute component={TutorDashboard} />}
          />
          <Route
            path="/TuteeDashboard"
            element={<PrivateRoute component={TuteeDashboard} />}
          />
          <Route
            path="/TutorReg"
            element={<PrivateRoute component={TutorReg} />}
          />
          <Route
            path="/TutorSettings"
            element={<PrivateRoute component={TutorSettings} />}
          />
          <Route
            path="/*"
            element={<NotFound />}
          />
          <Route 
            path="/tutor/:tutor._id" element={<RateTutor />} 
          />

        </Routes>
    </Router>
  </Provider>

)};

export default App;