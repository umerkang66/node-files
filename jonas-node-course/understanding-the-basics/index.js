const http = require('http');
const app = require('./app');
const server = http.createServer();

app(server);

const port = 8000;
const localHost = '127.0.0.1';

server.listen(port, localHost, () => {
  console.log(`Listening on port ${port}`);
});
