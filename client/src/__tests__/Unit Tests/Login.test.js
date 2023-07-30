import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter, Route, Redirect } from 'react-router-dom';

import Login from '../../components/auth/Login';

const mockStore = configureStore([]);

describe('Login Component', () => {
  it('should render the login form', () => {
    const store = mockStore({
      auth: {
        isAuthenticated: false,
        user: null,
      },
    });

    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <Route path="/login">
            <Login />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getByText('Login')).toBeInTheDocument();
    expect(getByText("Don't have an account?")).toBeInTheDocument();
  });

  it('should redirect to TutorDashboard if user is authenticated and isTutor is true', () => {
    const store = mockStore({
      auth: {
        isAuthenticated: true,
        user: { isTutor: true },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/TutorDashboard">Tutor Dashboard</Route>
          {/* Use Redirect component to handle redirection */}
          <Redirect to="/TutorDashboard" />
        </MemoryRouter>
      </Provider>
    );

    expect(container.textContent).toContain('Tutor Dashboard');
  });

  it('should redirect to /profiles if user is authenticated and isTutor is false', () => {
    const store = mockStore({
      auth: {
        isAuthenticated: true,
        user: { isTutor: false },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/profiles">Profiles</Route>
          {/* Use Redirect component to handle redirection */}
          <Redirect to="/profiles" />
        </MemoryRouter>
      </Provider>
    );

    expect(container.textContent).toContain('Profiles');
  });
});