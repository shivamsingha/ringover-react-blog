import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import App from '../App';

export const handlers = [
  rest.get('/api/entries/page/1', (req, res, ctx) => {
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

  rest.post('/api/user/isLogged', (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        isLogged: true,
        email: 'a@gmail.com',
        username: 'qwer',
      })
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

test('pagination', async () => {
  const history = createMemoryHistory();
  renderWithProviders(
    <Router history={history}>
      <App />
    </Router>
  );

  await waitFor(() => {
    screen.getByText('Next');
    expect(screen.queryByText('Prev')).toBeNull();
  });

  fireEvent.click(screen.getByRole('button', { name: /next/i }));

  await waitFor(() => {
    screen.getByText('Prev');
    expect(screen.queryByText('Next')).toBeNull();
  });
});
