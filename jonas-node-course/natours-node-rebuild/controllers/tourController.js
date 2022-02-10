const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

// ROUTE HANDLER MIDDLEWARES
exports.aliasTopTours = (req, res, next) => {
  // When it should reaches the getAllTours, its query object should be manipulated with appropriate values
  // Limit is 5, because we want top "5" tours, and make sure to set it as string
  req.query.limit = '5';
  // Because we wanted to be sorted by -ratingsAverage (high to low), if ratings are same, sort from price low to high
  req.query.sort = '-ratingsAverage,price';
  // Only send these fields as response
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  // Make sure to call next()
  next();
};

// ROUTE HANDLERS
exports.getAllTours = async (req, res) => {
  try {
    /* // Mongoose way of filtering
    const query = Tour.find()
      .where('duration')
      .equals(5)
      .where('difficulty')
      .equals('easy'); */

    // ADDING API FEATURES
    // 1st Argument: We can create query just by calling find without awaiting it
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // EXECUTE QUERY
    const tours = await features.query;

    // By using this json method, we already set the Content-Type header to 'application/json'
    res.status(200).json({
      // "200" means response OK
      status: 'success',
      results: tours.length,
      // We have set the tours because that's the name of the endpoint
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Cannot find tours',
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Cannot Find Tour',
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // req.body is !undefined because we have used a express.json() middleware
    const newTour = await Tour.create(req.body);

    // "201" means created
    res.status(201).json({
      status: 'success',
      data: { newTour },
    });
  } catch (err) {
    // "400" means bad request
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const { body } = req;
    const { id } = req.params;

    const tour = await Tour.findByIdAndUpdate(id, body, {
      // By using this, new updated document will be returned
      new: true,
      // It means run validator every time the tour is updated
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Data Send',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    // This "id" is a string
    const { id } = req.params;
    // Deleting the tour
    await Tour.findByIdAndDelete(id);

    // Deleting response is "204" which means "no content"
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Cannot Delete Tour',
    });
  }
};
