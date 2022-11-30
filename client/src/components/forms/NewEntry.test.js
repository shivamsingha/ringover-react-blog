import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen, queryByAttribute, render, findAllByText } from '@testing-library/react';
import NewEntry from './NewEntry';
import userEvent from '@testing-library/user-event';

const getByName = queryByAttribute.bind(null, 'name');

export const handlers = [
  rest.post('api/entries/new', async (req, res, ctx) => {
    const body = await req.json();
    if (
      body.hasOwnProperty('header') &&
      body['header'] !== '' &&
      body['header'] !== 'simulateError' &&
      body.hasOwnProperty('subheader') &&
      body['subheader'] !== '' &&
      body.hasOwnProperty('category') &&
      body['category'] !== '' &&
      body.hasOwnProperty('content') &&
      body['content'] !== ''
    )
      return res(
        ctx.status(201),
        ctx.json({ msg: 'Your entry has been added to the database.' })
      );
    return res(
      ctx.status(400),
      ctx.json({ msg: 'Please fill all the fields.' })
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

test('NewEntry rendering', async () => {
  render(<NewEntry />);

  userEvent.type(screen.getByPlaceholderText('Header'), 'testheader');
  userEvent.type(screen.getByPlaceholderText('Subheader'), 'testsybheader');
  userEvent.type(screen.getByPlaceholderText('Category'), 'testcategory');
  userEvent.type(screen.getByPlaceholderText('Content'), 'testcontent');
  userEvent.click(screen.getByDisplayValue('Submit'));

  await screen.findAllByText("Your entry has been added to the database.")
});

test('NewEntry error rendering', async () => {
  render(<NewEntry />);

  userEvent.type(screen.getByPlaceholderText('Header'), 'simulateError');
  userEvent.type(screen.getByPlaceholderText('Subheader'), 'testsybheader');
  userEvent.type(screen.getByPlaceholderText('Category'), 'testcategory');
  userEvent.type(screen.getByPlaceholderText('Content'), 'testcontent');
  userEvent.click(screen.getByDisplayValue('Submit'));

  await screen.findAllByText("Please fill all the fields.")
});
