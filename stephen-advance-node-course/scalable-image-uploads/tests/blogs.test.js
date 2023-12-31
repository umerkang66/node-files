const mongoose = require('mongoose');
const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  // IMP! On the travis make sure to add "http"
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

// For every file new connection with mongodb will be created, so disconnect in every test file, it is for jest, but in mocha, the connection only created one time
afterAll(async () => {
  await mongoose.disconnect();
});

describe('When logged in', () => {
  // This before will only be run for this describe statement, and event nested describes
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });

  test('Can see blog create form', async () => {
    const label = await page.getContentsOf('form label');
    expect(label).toEqual('Blog Title');
  });

  describe('And using valid input', () => {
    beforeEach(async () => {
      // First argument is selector, where you want to type into, and second is the text
      await page.type('.title input', 'My Title');
      await page.type('.content input', 'My Content');

      // Submit the form
      await page.click('form button');
    });

    test('Submitting takes user to review screen', async () => {
      const text = await page.getContentsOf('h5');
      // This expect means that we already have move to to next confirmation page
      expect(text).toEqual('Please confirm your entries');
    });

    test('Submitting then adds blog to index page', async () => {
      await page.click('button.green');

      // Use any selector that presents on the index page, but not on the confirmation page
      await page.waitFor('.card');

      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('p');

      // Check if the title and content are the same, that we put in the beforeEach statement
      expect(title).toEqual('My Title');
      expect(content).toEqual('My Content');
    });
  });

  describe('And using invalid inputs', () => {
    beforeEach(async () => {
      // To validation errors to be shown, click the "next" button
      await page.click('form button');
    });

    test('the form shows an error message', async () => {
      const titleError = await page.getContentsOf('.title .red-text');
      const contentError = await page.getContentsOf('.content .red-text');

      // toEqual value comes from browser, we have to see ourselves
      expect(titleError).toEqual('You must provide a value');
      expect(contentError).toEqual('You must provide a value');
    });
  });
});

describe('User is not logged in', () => {
  const actions = [
    {
      method: 'get',
      path: '/api/blogs',
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: {
        title: 'T',
        content: 'C',
      },
    },
  ];

  // This runs for both post and get request
  test('Blog related actions are prohibited', async () => {
    const results = await page.execRequests(actions);

    for (const result of results) {
      expect(result).toEqual({ error: 'You must log in!' });
    }
  });
});
