import React from 'react';
import { createMemoryHistory } from 'history';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Router } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import SignUp from './SignUp';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../utils/test-utils';

export const handlers = [
  rest.post('/api/user/signup', async (req, res, ctx) => {
    const body = await req.json();
    if (
      body.hasOwnProperty('email') &&
      body.hasOwnProperty('password') &&
      body.hasOwnProperty('c_password') &&
      body.hasOwnProperty('username')
    ) {
      let resmsg = [];
      if (body['email'] == 'email@email.com')
        resmsg.push('This email is already in use.');

      if (body['username'] == 'qwerQWER1')
        resmsg.push('This username is already in use.');

      if (resmsg.length > 0) return res(ctx.status(400), ctx.json(resmsg));
      return res(ctx.status(200), ctx.json(['User successfully registered!']));
    }
    return res(
      ctx.status(400),
      ctx.json(['Inputted data does not meet the requirements.'])
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

test('SignUp rendering', async () => {
  const history = createMemoryHistory();
  renderWithProviders(
    <Router history={history}>
      <SignUp />
    </Router>
  );

  userEvent.type(screen.getByPlaceholderText('Email'), 'new@email.com');
  userEvent.type(screen.getByPlaceholderText('Password'), 'password');
  userEvent.type(screen.getByPlaceholderText('Username'), 'username');
  userEvent.type(
    screen.getByPlaceholderText('Confirm your password'),
    'password'
  );
  userEvent.click(screen.getByDisplayValue('Submit'));

  await screen.findAllByText('User successfully registered!');
});

test('SignUp error rendering', async () => {
  const history = createMemoryHistory();
  renderWithProviders(
    <Router history={history}>
      <SignUp />
    </Router>
  );

  userEvent.type(screen.getByPlaceholderText('Email'), 'email@email.com');
  userEvent.type(screen.getByPlaceholderText('Password'), 'password');
  userEvent.type(screen.getByPlaceholderText('Username'), 'username');
  userEvent.type(
    screen.getByPlaceholderText('Confirm your password'),
    'password2'
  );
  userEvent.click(screen.getByDisplayValue('Submit'));

  await screen.findAllByText("Passwords don't match.");
});

test('SignUp error rendering', async () => {
  const history = createMemoryHistory();
  renderWithProviders(
    <Router history={history}>
      <SignUp />
    </Router>
  );

  userEvent.type(screen.getByPlaceholderText('Email'), 'email@email.com');
  userEvent.type(screen.getByPlaceholderText('Password'), 'password');
  userEvent.type(screen.getByPlaceholderText('Username'), 'qwerQWER1');
  userEvent.type(
    screen.getByPlaceholderText('Confirm your password'),
    'password'
  );
  userEvent.click(screen.getByDisplayValue('Submit'));

  await screen.findAllByText('This email is already in use.');
  await screen.findAllByText('This username is already in use.');
});

test('SignUp error rendering', async () => {
  const history = createMemoryHistory();
  renderWithProviders(
    <Router history={history}>
      <SignUp />
    </Router>
  );

  userEvent.type(screen.getByPlaceholderText('Email'), 'email@email.com');
  userEvent.type(screen.getByPlaceholderText('Password'), 'password');
  userEvent.type(screen.getByPlaceholderText('Username'), 'qwerQWE');
  userEvent.type(
    screen.getByPlaceholderText('Confirm your password'),
    'password'
  );
  userEvent.click(screen.getByDisplayValue('Submit'));

  await screen.findAllByText('This email is already in use.');
});

test('SignUp error rendering', async () => {
  const history = createMemoryHistory();
  renderWithProviders(
    <Router history={history}>
      <SignUp />
    </Router>
  );

  userEvent.type(screen.getByPlaceholderText('Email'), 'email2@email.com');
  userEvent.type(screen.getByPlaceholderText('Password'), 'password');
  userEvent.type(screen.getByPlaceholderText('Username'), 'qwerQWER1');
  userEvent.type(
    screen.getByPlaceholderText('Confirm your password'),
    'password'
  );
  userEvent.click(screen.getByDisplayValue('Submit'));

  await screen.findAllByText('This username is already in use.');
});
