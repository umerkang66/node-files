const passport = require('passport');

module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      // Google will give us access to the "profile" information and "email" address
      // These names of scopes comes from google itself
      scope: ['profile', 'email'],
    })
  );

  // Here code is sent back from google that again is sent to google by passport, then this will call the callback of passport.use({{firstArgument}}, callback) (in the passport.js file), and pass the accessToken, refreshToken, profile, and done
  // We send code to google and get user profile in exchange
  // Passport.authenticate is a middleware, after completing its task, it will call the next middleware
  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      // Then client side react-router-dom surveys will appear
      res.redirect('/surveys');
    }
  );

  app.get('/api/logout', (req, res) => {
    // This logout function is also set by passport on request obj
    // This take the cookie that contains the id, and it kills the id
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    // This req.user is got here from passport deserialize method
    res.send(req.user);
  });
};
