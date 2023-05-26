import './App.css';
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';
import React, { Fragment, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login'; 
import Alert from './components/layout/Alert'; 
import { loadUser } from './actions/auth';
//Redux
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utils/set_AuthToken';

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
  <Provider store={store}>
    <Router>
        <Navbar />
        <Alert />
        <Routes>
          <Route path='/' element={<Landing />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/login' element={<Login />}/>
        </Routes>
    </Router>
  </Provider>

)};

export default App;
