import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import Entry from './Entry';

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
    return res(ctx.status(200), ctx.json([]));
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

test('entry rendering', async () => {
  renderWithProviders(
    <Entry
      match={{
        params: { id: 'test----------------------------------------------' },
      }}
    />
  );

  await screen.findByText('test');
  await screen.findByText('subheader');
  await screen.findByText('content test');
  await screen.findByText(/qwer/i);
});

test('unavailable entry rendering', async () => {
  renderWithProviders(
    <Entry
      match={{
        params: { id: 'abc' },
      }}
    />
  );
});
