import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
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
