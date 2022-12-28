const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: 'config.env' });

require('./models');
const schema = require('./schema/schema');

const app = express();

// Replace with your mongoLab URI
const MONGO_URI = process.env.DB_URI;

if (!MONGO_URI) {
  throw new Error('You must provide a MongoLab URI');
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDb'))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.json());
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

module.exports = app;
