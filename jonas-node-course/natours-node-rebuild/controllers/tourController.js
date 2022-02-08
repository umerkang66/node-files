const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const Tour = require('../models/tourModel');

const filePath = path.join(rootDir, 'dev-data', 'data', 'tours-simple.json');
const tours = JSON.parse(fs.readFileSync(filePath));

// REQUEST MIDDLEWARES
// Param middlewares
exports.checkId = (req, res, next, val) => {
  // This will only run if the router has "id" param, that our below router has
  // 4th argument is actually the value of parameter that comes from request
  if (+val >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  // don't forget to call next, then the other functions (middlewares) will not run
  next();
};

// Middlewares before Route Handlers
exports.checkBody = (req, res, next) => {
  // We are accessing the body of request, so this should be run before the handler that has body property (POST, PATCH, DELETE etc.)
  const { name, price } = req.body;

  if (
    !name ||
    typeof name !== 'string' ||
    !price ||
    typeof price !== 'number'
  ) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid Request Body',
    });
  }

  // By calling next other functions will run
  next();
};

// ROUTE HANDLERS
exports.getAllTours = (req, res) => {
  // By using this json method, we already set the Content-Type header to 'application/json'
  res.status(200).json({
    // "200" means response OK
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    // We have set the tours because that's the name of the endpoint
    data: { tours },
  });
};

exports.getTour = (req, res) => {
  // Make sure to convert into number
  const id = +req.params.id;
  const requestedTour = tours.find(tour => tour.id === id);

  res.status(200).json({
    status: 'success',
    data: { tour: requestedTour },
  });
};

exports.createTour = (req, res) => {
  // req.body is !undefined because we have used a express.json() middleware
  const { body } = req;
  const newId = tours[tours.length - 1].id + 1;

  const newTour = { id: newId, ...body };
  tours.push(newTour);

  fs.writeFile(filePath, JSON.stringify(tours), err => {
    // "201" means created
    res.status(201).json({
      status: 'success',
      data: { newTour },
    });
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { tour: '<Updated tour here...>' },
  });
};

exports.deleteTour = (req, res) => {
  // Deleting response is "204" which means "no content"
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
