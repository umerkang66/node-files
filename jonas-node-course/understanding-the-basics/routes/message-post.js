const fs = require('fs');
// Hooks
const parsedBodyToString = require('../hooks/parsed-body-to-string');

module.exports = (req, res) => {
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

    fs.writeFile('message.txt', data, err => {
      if (err) console.log(err);

      // Redirecting to the "/" root page, redirecting has the status code of 302
      res.statusCode = 302;
      res.setHeader('Location', '/');

      // As the server callback has been returned the "res" object will still be accessed due to closures
      res.end();
    });
  });
};
