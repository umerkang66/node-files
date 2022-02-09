const mongoose = require('mongoose');

// We can specify the fields of a document, validate them, and also specify some error message
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    // Every name should be unique
    unique: true,
    // trim only works for strings, that will remove all the white space from either side of a string
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have duration'],
  },
  maxGroupSize: {
    // how many people can take part in a tour
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have duration'],
  },
  ratingsAverage: {
    // average rating of this tour (averaged from all the ratings (from reviews))
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    // how many people have gave the review (that also contains rating)
    type: Number,
    // if we don't specify this, the default will be 0
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    // trim only works for strings, that will remove all the white space from either side of a string
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    // because this will simply be the name of the image here
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  // multiple images that will be displayed on the detail page
  // images property will have multiple strings (array of strings)
  images: [String],
  createdAt: {
    // this is a time stamp that will be created when the tour is created
    // Date is another js built in datatype
    type: Date,
    // Date.now() will the give us the time in milliseconds
    default: Date.now(),
  },
  // different dates when tour starts, tour of same type can start on different times in a year
  startDates: [Date],
});

// Creating the model(collection: Tours) out of schema
const Tour = mongoose.model('Tours', tourSchema);

module.exports = Tour;
