const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

const billingRoutes = app => {
  // AUTH CHECKING MIDDLEWARE (requireLogin) RUNS BEFORE THIS
  app.post('/api/stripe', requireLogin, async (req, res) => {
    // This is where money is charged, so checking should be done before it
    await stripe.charges.create({
      // This amount is in cents
      amount: 500,
      currency: 'usd',
      description: '$5 for 5 credits',
      // This id come from frontend token
      source: req.body.id,
    });

    // User is logged in so user is at req.user
    req.user.credits += 5;
    const user = await req.user.save();

    // Send the user bcs credits property is on user, that has to be shown on the frontend
    res.send(user);
  });
};

module.exports = billingRoutes;
