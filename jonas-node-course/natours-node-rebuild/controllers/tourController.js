const Tour = require('../models/tourModel');

// ROUTE HANDLERS
exports.getAllTours = async (req, res) => {
  try {
    // Creating the shallow copy of req.query because all of the query parameters are not for filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    // Exclude excluded these fields from queryObj
    excludedFields.forEach(el => delete queryObj[el]);

    // Advance Filtering
    // when url /api/v1/tours?duration[gte]=5, if duration is "greater than or equal than" then This will come out of url { duration: { gte: '5' } }
    let queryStr = JSON.stringify(queryObj);
    // Replacing all the operators (gte, gt, lte, lt) with mongodb operators ($gte, $gt, $lte, $lt) (add $ sign before operators)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    // If there are not tours, find method will return an empty array
    // Mongodb way of filtering
    // BUILD QUERY
    // Without awaiting Tour.find send us query object where we can chain other methods
    let query = Tour.find(JSON.parse(queryStr));

    // Sorting
    // req comes as api/v1/tours?sort=price,ratingsAverage, if price is same then it will sort on the basis of ratingsAverage because that is the second field
    if (req.query.sort) {
      // here req.query.sort = price
      // If we set -price here mongoose will automatically sort it in the other order
      // If there are multiple values mongoose will expect a space between them, but there is a comma in the url
      const sortBy = req.query.sort.replaceAll(',', ' ');

      query = query.sort(sortBy);
    } else {
      // If user doesn't specify the sort field, we can still sort it by createdAt (in the descending order) so the newest ones will appear first
      query = query.sort('-createdAt');
    }

    // Limiting
    // The Url looks like this /api/v1/tours?fields=name,duration,difficulty,price
    // This means in the response only send name, duration, difficulty, price fields
    if (req.query.fields) {
      // Mongoose expects strings separated by spaces
      const fields = req.query.fields.replaceAll(',', ' ');

      // query select method limits the field, this is also called projecting
      query = query.select(fields);
    } else {
      // In case user doesn't specify the field the default is to remove "__v"
      query = query.select('-__v');
    }

    /* // Mongoose way of filtering
    const query = Tour.find()
      .where('duration')
      .equals(5)
      .where('difficulty')
      .equals('easy'); */

    // EXECUTE QUERY
    const tours = await query;

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
