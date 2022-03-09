const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const mongoose = require('mongoose');

// Getting user by the name of the collection that we specified in the User model file
const User = mongoose.model('users');

// Importing the configs
const keys = require('../config/keys');

// COOKIES ARE ALREADY WIRED UP IN THE EXPRESS APP (THIS IS FOR BOTH SERIALIZE_USER AND DESERIALIZE_USER)
// serialize user will create the token, with user id, and send it to the browser using cookies
passport.serializeUser((user, done) => {
  // This "user" document came from "done" callback from googleStrategyCallback, it can be created new one, or pulled out from our DB

  // This ".id" is not googleProfileId, but this is mongodb "id", that will use in the deserialize user

  // We don't know if the user has googleId, facebookId, githubId, but we know it will always have mongodb Id
  done(null, user.id);
});

// deserialize user will get the token from the cookies of browser, and get the user id, then it will check if the user is logged in or not
passport.deserializeUser(async (userId, done) => {
  const user = await User.findById(userId);
  // If the user is exists, then it will authorize the other requests
  done(null, user);

  // IMPORTANT! After this user will be added to the "req.user" property, that can be checked and in the "protect" middleware, and routes can be protected
});

// Creating google strategy that will be wired up in passport
// GoogleStrategyCallback
const googleStrategyCallback = async (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  // We have to profile.id to store in the DB, because google allows you to change email, and have multiple emails

  // 1) First check if user is already exist
  const existingUser = await User.findOne({ googleId: profile.id });

  // 2) If user exist, don't create new user in the DB
  if (existingUser) {
    // We are done with the user creation in DB, and there is not error, second argument is the existing user, that will be sent to the serializeUser method
    return done(null, existingUser);
  }

  // 3) Create if user doesn't exit
  const newUser = new User({ googleId: profile.id });
  await newUser.save();

  // We are done with the user creation in DB, and there is not error, second argument is the existing user, that will be sent to the serializeUser method
  done(null, newUser);
};

const googleStrategy = new GoogleStrategy(
  {
    clientID: keys.googleClientId,
    clientSecret: keys.googleClientSecret,
    // No need to put the whole url
    callbackURL: '/auth/google/callback',
    proxy: true,
  },
  // This will be called when the "/auth/google/callback" route will hit
  googleStrategyCallback
);

// Passport works with many strategies (like google, github)
// Register the google strategy to passport
// If anyone said that use passport.authenticate('google'), use me (this strategy)
passport.use(googleStrategy);
