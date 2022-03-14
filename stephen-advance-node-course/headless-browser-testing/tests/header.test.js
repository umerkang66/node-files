const puppeteer = require('puppeteer');

test('Adds two numbers', () => {
  const sum = 1 + 2;
  expect(sum).toEqual(3);
});

test('We can launch a browser', async () => {
  // Create headless browser (without UI)
  // By default launch will happens in headless mode (without UI)
  const browser = await puppeteer.launch({
    headless: false,
  });
  // Create browser tab (page)
  const page = await browser.newPage();
  // Go to http://localhost:5000
  await page.goto('http://127.0.0.1:3000');

  // Select the anchor tag from the dom
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);

  expect(text.toLowerCase() === 'Blogster');
});
