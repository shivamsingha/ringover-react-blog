import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import Nav from './Nav';

test('nav rendering', async () => {
  const history = createMemoryHistory();
  renderWithProviders(
    <Router history={history}>
      <Nav />
    </Router>
  );

  await screen.findByText(/sign in/i);
  await screen.findByText(/sign up/i);
});

test('nav rendering signed in', async () => {
  const history = createMemoryHistory();
  renderWithProviders(
    <Router history={history}>
      <Nav />
    </Router>,
    {
      preloadedState: {
        userReducer: {
          username: 'qwer',
          email: 'a@gmail.com',
          isLogged: true,
        },
      },
    }
  );

  await screen.findByText(/new entry/i);
  const signout = await screen.findByText(/sign out/i);
  userEvent.click(signout);

  await screen.findByText(/sign in/i);
  await screen.findByText(/sign up/i);
});
