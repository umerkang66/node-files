const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

const keys = require('./config/keys');

// Wiring up models, and make sure they are before everything where these models are used
require('./models/User');
require('./models/Survey');

// Wire up passport configuration, make sure it is before "authRoutes"
require('./services/passport');

const app = express();

// Body parser
app.use(express.json());

// Use cookies inside of this application
app.use(
  cookieSession({
    // This will expires after 30 days
    maxAge: 30 * 24 * 60 * 60 * 1000,
    // We can provide multiple keys, then it will pick any random key for encryption
    keys: [keys.cookieKey],
  })
);

// Passport should also use cookies session
app.use(passport.initialize());
app.use(passport.session());

// ROUTES
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  // FIRSTLY the express will check if the request for any static file has come, then it will serve static files, SECONDLY it will check about the routes for react router, then it will serve the index.html file that again will send the recommended static files

  // 1) Express will serve up production assets, like main.js file, or main.css file
  const staticPath = path.join(__dirname, 'client', 'build');
  app.use(express.static(staticPath));

  // 2) Express will serve up the index.html file if it doesn't recognize the route
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

// CONNECTING TO DB
mongoose.connect(keys.mongoUri).then(() => console.log('Connected to DB'));

// LISTENING ON PORT
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
