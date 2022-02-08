const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Tell where the config file is located, and get the config file before requiring the app.js file
dotenv.config({ path: './config.env' });
const app = require('./app');

/* This env variable is set by express
console.log(app.get('env'));

// but node js also set some environment variables, these are the following
console.log(process.env.NODE_ENV); */

// CONNECTING TO THE DB
// Creating the db connection string
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log('Db connection successful'));

// START THE SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

require('./models/tourModel');
