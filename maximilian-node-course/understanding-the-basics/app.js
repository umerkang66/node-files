// Routes
const homeRoute = require('./routes/home');
const messageRoute = require('./routes/message-post');
const randomRoute = require('./routes/random-page');

module.exports = server => {
  server.on('request', (req, res) => {
    const { url, method } = req;

    if (url === '/') return homeRoute(req, res);
    if (url === '/message' && method === 'POST') return messageRoute(req, res);

    // For every other page
    randomRoute(req, res);
  });
};
