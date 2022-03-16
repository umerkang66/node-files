const Page = require('./helpers/page');

// We need these variables in other functions as well
let page;

beforeEach(async () => {
  page = await Page.build();
  // IMP! On the travis make sure to add "http"
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  // Browser functionality is also handled by page
  await page.close();
});

test('it has the logo with correct text', async () => {
  // Select the anchor tag from the dom
  await page.waitFor('a.brand-logo');
  const text = await page.getContentsOf('a.brand-logo');
  expect(text.toLowerCase() === 'blogster');
});

test('clicking login starts oauth flow', async () => {
  await page.waitFor('.right a');
  await page.click('.right a');
  const url = await page.url();

  // Check if url contains "accounts.google.com"
  expect(url).toMatch(/accounts\.google\.com/);
});

test('when signed in, shows logout button', async () => {
  await page.login();
  const text = await page.getContentsOf('a[href="/auth/logout"]');

  expect(text).toEqual('Logout');
});
