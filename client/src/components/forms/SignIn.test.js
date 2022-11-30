import React from 'react';
import { createMemoryHistory } from 'history';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Router } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import SignIn from './SignIn';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../utils/test-utils';

export const handlers = [
  rest.post('/api/user/signin', async (req, res, ctx) => {
    const body = await req.json();
    if (
      body.hasOwnProperty('email') &&
      body['email'] !== 'email@email.com' &&
      body.hasOwnProperty('password') &&
      body['password'] !== 'password'
    )
      return res(
        ctx.status(200),
        ctx.json({
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InF3ZXIgICAgICAgICAgICAgICAgIiwiZW1haWwiOiJhQGdtYWlsLmNvbSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIiwiaWF0IjoxNjY5Nzg0MTQyLCJleHAiOjE2Njk3ODc3NDJ9.yR37ALAnx6r343uOYr8ibRZpuKrC_JR9NYSDy-xT3X8',
          user: {
            username: 'test',
            email: 'email@email.com',
          },
        })
      );
    return res(
      ctx.status(400),
      ctx.json({ msg: 'Email or password is incorrect.' })
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

test('SignIn rendering', async () => {
  const history = createMemoryHistory();
  renderWithProviders(
    <Router history={history}>
      <SignIn />
    </Router>
  );

  userEvent.type(screen.getByPlaceholderText('Email'), 'email@email.com');
  userEvent.type(screen.getByPlaceholderText('Password'), 'password');
  userEvent.click(screen.getByDisplayValue('Sign in'));

  await waitFor(() => {
    expect(history.entries).toMatchObject([
      {
        pathname: '/',
      },
    ]);
  });
});

test('SignIn error rendering', async () => {
  const history = createMemoryHistory();
  renderWithProviders(
    <Router history={history}>
      <SignIn />
    </Router>
  );

  userEvent.type(screen.getByPlaceholderText('Email'), 'email@email.com');
  userEvent.type(screen.getByPlaceholderText('Password'), 'wrongpassword');
  userEvent.click(screen.getByDisplayValue('Sign in'));

  await screen.findAllByText('Email or password is incorrect.');
});
