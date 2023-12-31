const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  /* SOLUTION 1:
  // Because the file is very large, it is not the best solution
  fs.readFile('test-file.txt', (err, data) => {
    console.log(data);
  });

  // 2nd Solution: Streams
  // Instead of storing the file, we can convert it into readable stream, as we received each chunk of data, we send it to the client as writable stream
  const readable = fs.createReadStream('test-file.txt');

  readable.on('data', chunk => {
    // Because res is a writable stream, and we can use the write method to send every piece of data into that stream
    res.write(chunk);
  });

  // We also have to handle the fact when all the data is read
  readable.on('end', () => {
    // We can call to end the http writable stream. As there is not data left
    res.end();
  });

  // Listening to the error
  readable.on('error', err => {
    console.log(err);
    res.statusCode(500);
    res.end('File not found');
  }); */
  // SOLUTION 3: This one handles back pressure by using the pipe operator. Pipe function is available on all readable streams. It pipe the output of a readable stream into the input of a writable stream because it automatically handles the speed

  const readable = fs.createReadStream('test-file.txt');

  // All we have to do call the pipe method on the readable stream, and pass the writable stream (or duplex stream, or transform stream) as argument
  readable.pipe(res);
});

// BACK_PRESSURE: When res cannot handle the the chunk that it is receiving, because receiving data is too fast, and faster than the data sending back to client through http response

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening...');
});
