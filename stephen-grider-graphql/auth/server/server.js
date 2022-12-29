const express = require('express');
require('./models');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
require('./services/auth');
const MongoStore = require('connect-mongo');
const schema = require('./schema');
require('dotenv').config({ path: 'conf.env' });

// Create a new Express application
const app = express();

if (!process.env.DB_URI) throw new Error('DB URI is not defined');
const MONGO_URI = process.env.DB_URI;

// Connect to the mongoDB instance and log a message
// on success or failure
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('🚀🚀🚀 Connected to DB'))
  .catch(err => console.log('✨✨✨ Err connecting DB', err));

// Configures express to use sessions.  This places an encrypted identifier
// on the users cookie.  When a user makes a request, this middleware examines
// the cookie and modifies the request object to indicate which user made the request
// The cookie itself only contains the id of a session; more data about the session
// is stored inside of MongoDB.

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: 'aaabbbccc',
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
    }),
  })
);

// Passport is wired into express as a middleware. When a request comes in,
// Passport will examine the request's session (as set by the above config) and
// assign the current user to the 'req.user' object.  See also servces/auth.js
app.use(passport.initialize());
app.use(passport.session());

// Instruct Express to pass on any request made to the '/graphql' route
// to the GraphQL instance.
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

module.exports = app;
