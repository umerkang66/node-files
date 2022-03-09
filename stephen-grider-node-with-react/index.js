const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

const keys = require('./config/keys');
// Wiring up models, and make sure they are before everything where these models are used
require('./models/User');
// Wire up passport configuration, make sure it is before "authRoutes"
require('./services/passport');

const app = express();

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

// CONNECTING TO DB
mongoose.connect(keys.mongoUri).then(() => console.log('Connected to DB'));

// LISTENING ON PORT
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
