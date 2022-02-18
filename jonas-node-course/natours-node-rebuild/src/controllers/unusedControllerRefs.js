// REQUEST MIDDLEWARES
// Param middlewares
exports.checkId = (req, res, next, val) => {
  const tours = [];

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
