// Importing the models
const Tour = require('../models/tourModel');
// Importing the utils
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get all Tour data from the collection
  const tours = await Tour.find();

  // 2 ) Render the template using the tour data from step 1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  // Reviews and tour guides are already populated from the model
  const tour = await Tour.findOne({ slug });

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});
