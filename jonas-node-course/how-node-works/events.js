import EventEmitter from 'events';
import http from 'http';

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new Sales();

myEmitter.on('newSale', () => {
  console.log('THERE WAS A NEW SALE');
});

myEmitter.on('newSale', () => {
  console.log('CUSTOMER NAME: UMER');
});

myEmitter.on('newSale', stock => {
  console.log(`YOU BOUGHT ${stock} PIECES`);
});

myEmitter.emit('newSale', 9);

/////////////////////////////
const server = http.createServer();
server.on('request', (req, res) => {
  console.log('REQUEST RECIEVED');
  res.end('REQUEST RECIEVED');
});

server.on('request', (req, res) => {
  console.log('ANOTHER REQUEST 😎');
});

server.on('close', (req, res) => {
  console.log('SERVER CLOSED');
});

server.listen(8000, '127.0.0.1', () => {
  console.log('waiting for requests');
});
