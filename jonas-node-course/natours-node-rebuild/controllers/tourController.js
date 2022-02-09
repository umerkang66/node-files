const Tour = require('../models/tourModel');

// ROUTE HANDLERS
exports.getAllTours = async (req, res) => {
  try {
    // If there are not tours, find method will return an empty array
    const tours = await Tour.find();

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
