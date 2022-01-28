const express = require('express');
const bodyParser = require('body-parser');

// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

// Middlewares
// This middlewares get data from urls
// Extended: true means if it should be able to parse non-default features you could say
app.use(bodyParser.urlencoded({ extended: false }));

/* DUMMY MIDDLEWARES
app.use((req, res, next) => {
  console.log('Hello from first middleware');
  // By calling the next, express will move to the other middlewares, if we don't call next, the request will pause, and the response cannot be sent
  next();
}); */

// Routes wired in express
// Shop route has "/" path. The route that has just "/" should be at last, because every route starts will "/", if this one will be at top, for every request whose url starts with "/", the below function will be executed
// Middlewares will run from top to bottom
// The first argument will apply to all of the admin routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// CatchAll middleware to send a 404 page
app.use((req, res, next) => {
  res.status(404).send('<h1>Page Not Found</h1>');
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Listening to port: ${port}`);
});
