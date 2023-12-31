const crypto = require('crypto');
const express = require('express');
const app = express();

// "http" requests are also asynchronous
app.get('/', (req, res) => {
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    res.send('<h1>Hi There</h1>');
  });
});

app.get('/fast', (req, res) => {
  res.send('<h1>This was fast</h1>');
});

app.listen(3000, () => {
  console.log('App is listening on port 3000');
});

// START THE CLUSTER: "0" means just figure out how many cluster you should made according to the cpu logical layer
// "pm2 start index.js -i 0"

// DELETE THE CLUSTERS
// "pm2 delete index"

// MONIT THE CLUSTERS
// "pm2 monit"

// SHOW THE CLUSTER OF FROM WHICH FILE WAS CREATED
// "pm2 show <filename>"

// LIST ALL THE CLUSTERS
// "pm2 list"
