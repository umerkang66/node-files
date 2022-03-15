const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
  static async build() {
    // Create headless browser (without UI)
    // By default launch will happens in headless mode (without UI)
    const browser = await puppeteer.launch({
      headless: false,
    });

    // Combine page, customPage, and browser through proxy

    // Create browser tab (page)
    const page = await browser.newPage();
    const customPage = new CustomPage(page, browser);

    return new Proxy(customPage, {
      get: function (target, property) {
        // "target" is also customPage
        return customPage[property] || page[property] || browser[property];
      },
    });
  }

  constructor(page, browser) {
    this.page = page;
    this.browser = browser;
  }

  close() {
    // Both browser, and page has close() function, but we only want browser close function
    this.browser.close();
  }

  async login() {
    // Faking logged in to our application
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    // Set cookies on the browser
    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });
    // Refresh the page
    await this.page.goto('http://localhost:3000/blogs');
    // Testing environment tends to do things as fast as possible, and it executes even before the page loaded, thus we have introduce a little pause here
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }

  // MAKE HTTP REQUESTS
  async get(path) {
    // THIS WILL RETURN PROMISE THAT WE HAVE TO AWAIT (RESOLVE)

    // "evaluate" func will convert the code in string and send it to the chromium, chromium executes it, and then send the result back to jest, that is stored in result

    // When evaluate will convert the function into string, there will be no closure and no path variable inside the evaluate callback function, we have to pass these variables as the second argument to evaluate function

    // This _path is coming from the second argument of evaluate function
    return await this.page.evaluate(_path => {
      return fetch(_path, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        // "res.json()" will be returned and become the result
      }).then(res => res.json());
    }, path);
  }

  async post(path, data) {
    return await this.page.evaluate(
      (_path, _data) => {
        return fetch(_path, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(_data),
        }).then(res => res.json());
      },
      path,
      data
    );
  }

  // This function will return promise, so await it after using it
  async execRequests(actions) {
    return await Promise.all(
      actions.map(({ method, path, data }) => {
        // method can be "get" or "post"
        // In case of get requests, data is undefined, that is okay, bcs, we are not accepting more than 1 arguments in get request
        return this[method](path, data);
      })
    );
  }
}

module.exports = CustomPage;
