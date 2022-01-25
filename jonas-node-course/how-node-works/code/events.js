const EventEmitter = require('events');
const http = require('http');

// Just like this, http module, fs module implements events just like this
class SalesEvents extends EventEmitter {
  constructor() {
    super();
  }
}

const emitter = new SalesEvents();

emitter.on('newSale', () => {
  console.log('Sale Event is emitted');
});

emitter.on('newSale', () => {
  console.log('Customer name: Umer');
});

emitter.on('newSale', stock => {
  console.log(`There are now ${stock} items left in the stock`);
});

// We can pass other arguments, that will become arguments of callback functions
emitter.emit('newSale', 9);

/////////////////
// ANOTHER EXAMPLE USING HTTP
const server = http.createServer();

server.on('request', (req, res) => {
  console.log('Request Received');
  res.end('Request received');
});

server.on('request', (req, res) => {
  console.log('Another Request received');
});

server.on('close', () => {
  console.log('Server closed');
});

// Server will emit request event twice, because one for the "/" root url and the other for "/favicon" request (that is made by browser automatically) that's why there will be 4 console.logs
server.listen(8000, '127.0.0.1', () => {
  console.log('Server is listening on port 8000');
});
