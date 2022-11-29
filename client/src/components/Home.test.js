import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import Home from './Home';

export const handlers = [
  rest.get('/api/entries/page/1', (req, res, ctx) => {
    console.error("asdfa")
    return res(
      ctx.status(200),
      ctx.json([
        {
          header: 'g                                                 ',
          subheader:
            'g                                                                                                                                                                                                                                                                                                           ',
          cateogry:
            'g                                                                                                   ',
          content: 'g',
          author: 'qwer                                              ',
          date: '29/11/2022 20:29    ',
          row_number: '7',
          link: 'g-------------------------------------------------',
        },
        {
          header: 'f                                                 ',
          subheader:
            'f                                                                                                                                                                                                                                                                                                           ',
          cateogry:
            'f                                                                                                   ',
          content: 'f',
          author: 'qwer                                              ',
          date: '29/11/2022 20:29    ',
          row_number: '6',
          link: 'f-------------------------------------------------',
        },
        {
          header: 'e                                                 ',
          subheader:
            'e                                                                                                                                                                                                                                                                                                           ',
          cateogry:
            'e                                                                                                   ',
          content: 'e',
          author: 'qwer                                              ',
          date: '29/11/2022 20:29    ',
          row_number: '5',
          link: 'e-------------------------------------------------',
        },
        {
          header: 'd                                                 ',
          subheader:
            'd                                                                                                                                                                                                                                                                                                           ',
          cateogry:
            'd                                                                                                   ',
          content: 'd',
          author: 'qwer                                              ',
          date: '29/11/2022 20:29    ',
          row_number: '4',
          link: 'd-------------------------------------------------',
        },
        {
          header: 'c                                                 ',
          subheader:
            'c                                                                                                                                                                                                                                                                                                           ',
          cateogry:
            'c                                                                                                   ',
          content: 'c',
          author: 'qwer                                              ',
          date: '29/11/2022 20:29    ',
          row_number: '3',
          link: 'c-------------------------------------------------',
        },
        {
          header: 'b                                                 ',
          subheader:
            'b                                                                                                                                                                                                                                                                                                           ',
          cateogry:
            'b                                                                                                   ',
          content: 'b',
          author: 'qwer                                              ',
          date: '29/11/2022 20:29    ',
          row_number: '2',
          link: 'b-------------------------------------------------',
        },
      ])
    );
  }),

  rest.get('/api/entries/page/2', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          header: 'a                                                 ',
          subheader:
            'a                                                                                                                                                                                                                                                                                                           ',
          cateogry:
            'a                                                                                                   ',
          content: 'a',
          author: 'qwer                                              ',
          date: '29/11/2022 20:29    ',
          row_number: '1',
          link: 'a-------------------------------------------------',
        },
      ])
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

test('fetches & receives a user after clicking the fetch user button', async () => {
  renderWithProviders(<Home />);

  // should show no user initially, and not be fetching a user
  expect(await screen.getByText(/next/i)).toBeInTheDocument();
  expect(screen.getByText(/prev/i)).not.toBeInTheDocument();

  // after clicking the 'Fetch user' button, it should now show that it is fetching the user
  fireEvent.click(screen.getByRole('button', { name: /next/i }));

  expect(await screen.getByText(/prev/i)).toBeInTheDocument();
  expect(screen.getByText(/next/i)).not.toBeInTheDocument();
});
