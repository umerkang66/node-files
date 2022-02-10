const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rootDir = require('./utils/path');

// Importing the routes
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES: These are the functions that can modify the request objects. Middlewares that exists firsts in the code, will be executed first
// By using the express.json() data from the request body (that comes in streams) collected and stored the req.body object
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  // Only use morgan if we are in development mode
  // Morgan is a logging middleware (that logs about requests)
  app.use(morgan('dev'));
}

// Serving static files
const staticFilesPath = path.join(rootDir, 'public');
// Fi express doesn't find any route, it will try to get that file from "public folder" because that is what we have specify in the express static middleware
app.use(express.static(staticFilesPath));

// In "use" methods we can specify any middlewares that calls next unless we send the response to client (ending the request-response cycle)
app.use((req, res, next) => {
  // Because we didn't specify an routes, this middleware will run for every request
  req.requestTime = new Date().toISOString();
  next();
});

// PLUGGING THE ROUTES IN EXPRESS
// We can also specify the routes in the use function, then callback functions will be applied to specifically to that request url
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
