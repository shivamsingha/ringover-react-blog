import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import App from '../App';

const page1res = [
  {
    header: 'head8                                             ',
    subheader:
      'sub8                                                                                                                                                                                                                                                                                                        ',
    cateogry:
      'cat2                                                                                                ',
    content: 'con8',
    author: 'qwer                                              ',
    date: '30/11/2022 09:47    ',
    row_number: '8',
    link: 'head8---------------------------------------------',
  },
  {
    header: 'head7                                             ',
    subheader:
      'sub7                                                                                                                                                                                                                                                                                                        ',
    cateogry:
      'cat3                                                                                                ',
    content: 'con7',
    author: 'qwer                                              ',
    date: '30/11/2022 09:46    ',
    row_number: '7',
    link: 'head7---------------------------------------------',
  },
  {
    header: 'head6                                             ',
    subheader:
      'sub6                                                                                                                                                                                                                                                                                                        ',
    cateogry:
      'cat1                                                                                                ',
    content: 'con6',
    author: 'qwer                                              ',
    date: '30/11/2022 09:46    ',
    row_number: '6',
    link: 'head6---------------------------------------------',
  },
  {
    header: 'head5                                             ',
    subheader:
      'sub5                                                                                                                                                                                                                                                                                                        ',
    cateogry:
      'cat3                                                                                                ',
    content: 'con5',
    author: 'qwer                                              ',
    date: '30/11/2022 09:46    ',
    row_number: '5',
    link: 'head5---------------------------------------------',
  },
  {
    header: 'head4                                             ',
    subheader:
      'sub4                                                                                                                                                                                                                                                                                                        ',
    cateogry:
      'cat1                                                                                                ',
    content: 'con4',
    author: 'qwer                                              ',
    date: '30/11/2022 09:46    ',
    row_number: '4',
    link: 'head4---------------------------------------------',
  },
  {
    header: 'head3                                             ',
    subheader:
      'sub3                                                                                                                                                                                                                                                                                                        ',
    cateogry:
      'cat2                                                                                                ',
    content: 'con3',
    author: 'qwer                                              ',
    date: '30/11/2022 09:46    ',
    row_number: '3',
    link: 'head3---------------------------------------------',
  },
];

const page2res = [
  {
    header: 'head2                                             ',
    subheader:
      'sub2                                                                                                                                                                                                                                                                                                        ',
    cateogry:
      'cat2                                                                                                ',
    content: 'con2',
    author: 'qwer                                              ',
    date: '30/11/2022 09:46    ',
    row_number: '2',
    link: 'head2---------------------------------------------',
  },
  {
    header: 'head1                                             ',
    subheader:
      'sub1                                                                                                                                                                                                                                                                                                        ',
    cateogry:
      'cat1                                                                                                ',
    content: 'con1',
    author: 'qwer                                              ',
    date: '30/11/2022 09:45    ',
    row_number: '1',
    link: 'head1---------------------------------------------',
  },
];

export const handlers = [
  rest.get('/api/entries/page/1', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(page1res));
  }),

  rest.get('/api/entries/page/2', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(page2res));
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

  page1res.map((entry) => {
    screen.getAllByText(new RegExp(entry.header.trim()));
    screen.getAllByText(new RegExp(entry.subheader.trim()));
    screen.getAllByText(new RegExp(entry.author.trim()));
    screen.getAllByText(new RegExp(entry.date.trim()));
  });

  fireEvent.click(screen.getByRole('button', { name: /next/i }));

  await waitFor(() => {
    screen.getByText('Prev');
    expect(screen.queryByText('Next')).toBeNull();
  });

  page2res.map((entry) => {
    screen.getAllByText(new RegExp(entry.header.trim()));
    screen.getAllByText(new RegExp(entry.subheader.trim()));
    screen.getAllByText(new RegExp(entry.author.trim()));
    screen.getAllByText(new RegExp(entry.date.trim()));
  });
});
