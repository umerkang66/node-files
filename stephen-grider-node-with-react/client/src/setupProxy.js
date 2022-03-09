const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    // If we send request to our backend from frontend, don't send it to the port 3000, but send it to the port 5000 (in development env)

    app.use(
        ['/api', '/auth/google', '/api/*'],
        createProxyMiddleware({
            target: 'http://localhost:5000',
        })
    );
};
