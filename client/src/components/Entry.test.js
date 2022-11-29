import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import App from '../App';

export const handlers = [
  rest.get(
    '/api/entries/test----------------------------------------------',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            header: 'test                                              ',
            subheader:
              'subheader                                                                                                                                                                                                                                                                                                   ',
            cateogry:
              'cat1                                                                                                ',
            content: 'content test',
            author: 'qwer                                              ',
            date: '29/11/2022 21:46    ',
          },
        ])
      );
    }
  ),

  rest.get('/api/entries/abc', (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

test('entry rendering', async () => {
  const history = createMemoryHistory();
  history.push('/entry/test----------------------------------------------');
  renderWithProviders(
    <Router history={history}>
      <App />
    </Router>
  );
  
  screen.getByText(/test/i)
  screen.getByText(/subheader/i)
  screen.getByText('content test')
  screen.getByText(/qwer/i)
  screen.getByText(/cat1/i)
});

test('unavailable entry rendering', async () => {
  const history = createMemoryHistory();
  history.push('/entry/abc');
  renderWithProviders(
    <Router history={history}>
      <App />
    </Router>
  );

  expect(screen.getAllByRole('p')).toHaveTextContent("")
});

