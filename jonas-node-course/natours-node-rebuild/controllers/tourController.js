// Importing Models
const Tour = require('../models/tourModel');

// Importing Utils
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// ROUTE HANDLER MIDDLEWARES
exports.aliasTopTours = (req, res, next) => {
  // When it should reaches the getAllTours, its query object should be manipulated with appropriate values
  // Limit is 5, because we want top "5" tours, and make sure to set it as string
  req.query.limit = '5';
  // Because we wanted to be sorted by -ratingsAverage (high to low), if ratings are same, sort from price (low to high)
  req.query.sort = '-ratingsAverage,price';
  // Only send these fields as response
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  // Make sure to call next()
  next();
};

// ROUTE HANDLERS
// catchAsync can also be called in the router file (that would have the same result), but we didn't do it because, we have to remember which function is the async and which function is not
exports.getAllTours = catchAsync(async (req, res, next) => {
  /* // Mongoose way of filtering
  const query = Tour.find()
    .where('duration')
    .equals(5)
    .where('difficulty')
    .equals('easy'); */

  // ADDING API FEATURES
  // 1st Argument: We can create query just by calling find without awaiting it
  // We can use api features on every api endpoint that has find({}) query, create new instance of APIFeatures then just call the method, which feature we want to use
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // EXECUTE QUERY
  const tours = await features.query;

  // SENDING RESPONSE
  // By using this json method, we already set the Content-Type header to 'application/json'
  res.status(200).json({
    // "200" means response OK
    status: 'success',
    results: tours.length,
    // We have set the tours because that's the name of the endpoint
    data: { tours },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // This "id" is string
  const { id } = req.params;
  const tour = await Tour.findById(id);

  // If there is not tour, it is null
  if (!tour) {
    // Both Method 1, and 2 will work here

    // Method 1: This error will be sent in catchAsync catch block to next function
    // throw new AppError('Tour with this id is not found', 404);

    // Method 2: This error is explicitly send off the next function here in this current function
    // Make sure to return it
    return next(new AppError('Tour with this id is not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

// The function that should be exported from controller, should be a function (not the returned value from function call)
exports.createTour = catchAsync(async (req, res, next) => {
  // req.body is !undefined because we have used a express.json() middleware
  const newTour = await Tour.create(req.body);

  // "201" means created
  res.status(201).json({
    status: 'success',
    data: { newTour },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
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
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  // This "id" is a string
  const { id } = req.params;
  // Deleting the tour
  await Tour.findByIdAndDelete(id);

  // Deleting response is "204" which means "no content"
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  // Using aggregation pipeline (this is a mongodb feature)
  // We pass in an array of so-called stages (what happens in each stage, then documents pass through these stages and be manipulated)
  // Each stage is an object
  const stats = await Tour.aggregate([
    // 1) $match: It is basically just  filter for certain fields (just like filter object in query methods)
    {
      // This stage is the preliminary stage for the next stages to compare
      $match: {
        // We only want to select an element which has ratingsAverage [gte] to 4.5
        ratingsAverage: { $gte: 4.5 },
      },
    },

    // 2) $group: It will group documents together using accumulators
    {
      // For example we can calculate an average
      $group: {
        // we always need to specify _id, because this is where we will specify what we want to group by (group the documents), now we dont want to group them (separate them by groups), we just want every document in one group (so we can calculate the statistics of all the tours together), we can also group them (like group them with difficulty, then calculate the average of easy tours, medium tours, and difficult tours)
        // _id: null,
        // now group them by difficulty
        _id: { $toUpper: '$difficulty' },
        // also with ratingsAverage
        // _id: '$ratingsAverage',
        // The name of the fields of document that are specified in strings, should be start with "$" sign only in the aggregation pipeline
        numTours: {
          // When we will go through each document, 1 will be added to numTours
          $sum: 1,
        },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },

    // Another stage "sort" stage
    // In the next stage, we can only use the names that are specified in the previous stages, so instead of "price" we have to use avgPrice
    {
      $sort: { avgPrice: 1 },
    },

    /* 
        // we can also repeat stages
        {
          // this will remove the 'EASY' group from response result
          $match: { _id: { $ne: 'EASY' } },
        },
      */
  ]);

  // Sending response
  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});

// This will tell us the busiest month of the tours
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year;

  const plan = await Tour.aggregate([
    {
      // $unwind will deconstruct an array of fields into documents, and then output one document for each element (in our case, single document will be sended 3 times if the startDates is an array of 3 elements, and every tour (document) will have its own single start date)
      $unwind: '$startDates',
    },

    // Now select documents for the years that was passed through req
    {
      $match: {
        // Tours date should be greaterEqual than January 1st of [year] and lessEqual than 31st december of [year]
        startDates: {
          // year-month-day
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },

    // Now group them with month
    {
      $group: {
        _id: {
          // Here startDates is not an array but a single value, bcs of the upper match field, id will also return month as number
          $month: '$startDates',
        },
        numTourStarts: { $sum: 1 },
        // $push will create an array
        // All the tours that would have same month, will be pushed to this tours array
        tours: { $push: '$name' },
      },
    },

    // $addFields will add value, in our case we need to add month value same as "_id" value
    {
      $addFields: { month: '$_id' },
    },

    // $project can add or delete values from the response, if we add 1 as the value, it will only send that field, if we add zero, it will send everything except that field with 0 value
    {
      $project: { _id: 0 },
    },

    // Sorting with the "_id" field that we specified above
    {
      $sort: { numTourStarts: -1 },
    },

    /*
      // $limit will limit the result
      {
        $limit: 1,
      },
    */
  ]);

  // Sending response
  res.status(200).json({
    status: 'success',
    data: { plan },
  });
});
