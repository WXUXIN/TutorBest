import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TutorDashboard from '../components/dashboard/TutorDashboard';

const mockStore = configureStore([]);

describe('TutorDashboard Component', () => {
  it('should render the tutor dashboard correctly', () => {
    const store = mockStore({
      auth: {
        user: {
          _id: 'user_id_here',
          isTutor: true,
          name: 'John Doe',
          photo: 'user_photo.jpg',
        },
      },
      profiles: {
        profile: {
          user: { _id: 'user_id_here' },
          linkingRequests: [],
          ratings: [],
          subjectList: [
            { subject: 'Math', level: 'Basic', price: 20 },
            { subject: 'English', level: 'Intermediate', price: 25 },
          ],
          highestQualification: 'Ph.D. in Mathematics',
          description: 'Experienced math tutor',
          tutees: [],
        },
        loading: false,
      },
    });

    const { getByText, getByAltText } = render(
      <Provider store={store}>
        <TutorDashboard />
      </Provider>
    );

    // Check if the tutor's name is rendered
    expect(getByText('Welcome,')).toBeInTheDocument();
    expect(getByText('John Doe')).toBeInTheDocument();

    // Check if subjects are rendered
    expect(getByText('Your Subjects:')).toBeInTheDocument();
    expect(getByText('Subject: Math | Level: Basic | Price: 20/hr')).toBeInTheDocument();
    expect(getByText('Subject: English | Level: Intermediate | Price: 25/hr')).toBeInTheDocument();

    // Check if highest qualification is rendered
    expect(getByText('Your Highest Qualification:')).toBeInTheDocument();
    expect(getByText('Ph.D. in Mathematics')).toBeInTheDocument();

    // Check if description is rendered
    expect(getByText('Your Description:')).toBeInTheDocument();
    expect(getByText('Experienced math tutor')).toBeInTheDocument();

    // Check if user photo is rendered
    const userPhoto = getByAltText('User Avatar');
    expect(userPhoto).toBeInTheDocument();
    expect(userPhoto.getAttribute('src')).toBe('user_photo.jpg');
  });

  it('should redirect to /TutorReg if the user is not a tutor', () => {
    const store = mockStore({
      auth: {
        user: {
          _id: 'user_id_here',
          isTutor: false,
        },
      },
      profiles: {
        profile: null,
        loading: false,
      },
    });

    render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/login']}>
            <Route path="/login">
              <TutorDashboard />
            </Route>
            <Route path="/profiles">Profiles</Route>
            {/* Redirect to /TutorReg */}
            <Route path="/TutorReg">Tutor Registration Page</Route>
          </MemoryRouter>
        </Provider>
      );

    // Check that the user is redirected to /TutorReg
    expect(container.innerHTML).toContain('TutorReg');
  });
});