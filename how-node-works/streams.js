import fs from 'fs';
import http from 'http';

const server = http.createServer();

server.on('request', (req, res) => {
  /*
  // BASIC SOLUTION
  fs.readFile('test-file.txt', 'utf-8', data => {
    res.end(data);
  });

  // SOLUTION USING STREAMS
  const readable = fs.createReadStream('./test-file.txt');

  readable.on('data', chunk => {
    res.write(chunk);
  });

  readable.on('end', () => {
    res.end();
  });

  readable.on('error', err => {
    console.log(err);
    res.statusCode = 500;
    res.end('File not found');
  });
  */

  // SOLUTION 2: PIPE OPERATOR: GETTING THE READABLE STREAM AND PUT IT IN THE WRITEABLE STREAM USING PIPE METHOD
  const readable = fs.createReadStream('test-file.txt');
  readable.pipe(res);

  readable.on('error', err => {
    console.log(err);
    res.statusCode = 500;
    res.end('File not found');
  });
});

server.listen(8000, '127.0.0.1', () => {
  console.log('SERVER IS RUNNING ON PORT 8000...');
});
