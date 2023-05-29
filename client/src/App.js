import './App.css';
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';
import React, { Fragment, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login'; 
import Dashboard from './components/dashboard/Dashboard'; 
import Alert from './components/layout/Alert';
import { loadUser } from './actions/auth';
//Redux
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utils/set_AuthToken';
import PrivateRoute from './components/routing/PrivateRoute';
import NotFound from './components/layout/NotFound';

import './App.css';

if(localStorage.token) {
  setAuthToken(localStorage.token);
}

// The app component is the main component that will be rendered in the index.js file.
// Look at useEffect hook. This is a hook that will run when the component mounts.
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    // The provided code represents the App component in a React application. 
    // It sets up the routing and renders different components based on the specified routes. 
    // The below code will be placed inside the App component which will be rendered in the index.js file
    // which  will be rendered in the root element of the HTML file.
  <Provider store={store}>
    <Router>
        <Navbar />
        <Alert />
        <Routes>
          {/* Depending on which route the user types in, we will render the Landing, 
          Register, or Login component. */}
          <Route path='/' element={<Landing />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/login' element={<Login />}/>
          <Route
            path="dashboard"
            element={<PrivateRoute component={Dashboard} />}
          />
          <Route
            path="/*"
            element={<NotFound />}
          />
        </Routes>
    </Router>
  </Provider>

)};

export default App;
