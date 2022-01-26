const http = require('http');
const fs = require('fs');
const parsedBodyToString = require('./hooks/parsed-body-to-string');

const server = http.createServer();

server.on('request', (req, res) => {
  const { url, method } = req;

  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Enter message</title></head>');
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Submit</button></form></body>'
    );
    res.write('</html>');

    return res.end();
  }

  if (url === '/message' && method === 'POST') {
    const body = [];
    // Getting the data from request
    req.on('data', chunk => {
      // Data will come in chunks that will be pushed in the body array
      body.push(chunk);
    });

    // These Event Listeners will only register the callbacks, not run it immediately, but be called when the proper event is emitted, so do all the file saving logic in the callback, if we do after that will run before the "end" callback will run
    // We have to return here as the callback registers, if not the code for "random page" will run, it will give error (because two responses cannot be sent)
    return req.on('end', () => {
      // When data streaming "end", we can react on it
      // Covert the chunk array (chunk is also buffer) into buffer
      const parsedBodyBuffer = Buffer.concat(body);
      // Then converting to string, because we know it will be a string
      const parsedBody = parsedBodyBuffer.toString();

      const data = parsedBodyToString(parsedBody);

      fs.writeFileSync('message.txt', data);
      // Redirecting to the "/" root page, redirecting has the status code of 302
      res.statusCode = 302;
      res.setHeader('Location', '/');

      // As the server callback has been returned the "res" object will still be accessed due to closures
      res.end();
    });
  }

  // This will done for any url
  res.setHeader('Content-Type', 'text/html');

  res.write('<html>');
  res.write('<head><title>Page from Node Js</title></head>');
  res.write('<body><h1>This is the random page from node js</h1></body>');
  res.write('</html>');

  res.end();
});

const port = 8000;
const localHost = '127.0.0.1';

server.listen(port, localHost, () => {
  console.log(`Listening on port ${port}`);
});
