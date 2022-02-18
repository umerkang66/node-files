const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

// We can specify the fields of a document, validate them, and also specify some error message
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      // Every name should be unique (unique is technically not a validator)
      unique: true,
      // trim only works for strings, that will remove all the white space from either side of a string
      trim: true,
      // maxlength and minlength both are "String" validators
      // Validators can be array with the second value of array is error message
      maxlength: [
        40,
        'A tour name should have less or equal than 40 characters',
      ],
      minlength: [
        10,
        'A tour name should have more or equal than 10 characters',
      ],
      // Using validator library, don't call the function just say that this is the function that is going to be used, This also checks for spaces, so not that useful
      /* validate: [validator.isAlpha, 'Tour name should only contain letters'], */
    },
    slug: String,
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
      // Its like some field Interface or Type that difficulty should easy, medium or hard
      enum: {
        // We cannot specify the error message in this values array,
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either, easy, medium, difficult',
      },
    },
    ratingsAverage: {
      // average rating of this tour (averaged from all the ratings (from reviews))
      type: Number,
      default: 4.5,
      // Min rating should 1, and max should be 5
      // "min" and "max" are also for Numbers and Dates
      min: [1, 'Rating must be above or equal to 1.0'],
      max: [5, 'Rating must be less or equal to 5'],
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
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (priceDiscount) {
          // Here "this" is the current document
          // "this" only points to current doc on NEW Document creation
          return priceDiscount < this.price;
        },
        // {VALUE}: It is just mongoose thing and it is equal to the priceDiscount
        message: 'Price Discount ({VALUE}) should be less than Price itself',
      },
    },
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
      // By selecting false, this will be automatically removed from the response result
      select: false,
    },
    // different dates when tour starts, tour of same type can start on different times in a year
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    // When converting it to json, make sure to add Virtual Properties
    toJSON: { virtuals: true },
    // Also when the data get outputted as object
    toObject: { virtuals: true },
  }
);

// VIRTUAL PROPERTIES
// Virtual Properties are not saved in the DB, but created on the fly
// We cannot use this virtual property in the query, because they are not part of the DB
tourSchema.virtual('durationWeeks').get(function () {
  // Here "this" is instance of Tour Model
  // Convert the duration time into weekly time
  return this.duration / 7;
});

// MONGOOSE MIDDLEWARES
// There are 4 types of mongoose middlewares, document, query, aggregate, and model middlewares, we can have multiple pre, and post middlewares
// 1) Document Middlewares
tourSchema.pre('save', function (next) {
  // It runs before "save()" command and create() command (IMP !insertMany(), !insertOne() !findByIdAndUpdate() !findOneAndUpdate)
  // This callback will run before the saving of tour document
  // Here "this" is the currently processed document
  // Add slug before saving the new document
  this.slug = slugify(this.name, {
    // Also convert it to the lowercase
    lower: true,
  });

  // Make sure to call next
  next();
});

/* tourSchema.pre('save', function (next) {
  console.log('From tourSchema second pre save middleware 😀😀😀');
  next();
});

// Post document middleware: we have access to the nextFunction but also, document that has been saved as the first argument
tourSchema.post('save', function (doc, next) {
  console.log('From tourSchema Post middleware 😀😀😀 ', this === doc);
  // "this" and "doc" will point to the same document that has been saved ("this" === "doc")
  next();
}); */

// 2) Query Middleware
// pre, and post "find" middleware (hook) is going to run before and after respectively of every "find" query
// This middleware should execute for every query methods that starts with "find" (find, findById, findOne)
tourSchema.pre(/^find/, function (next) {
  // We can filter out the secretTour using this query operator
  // Here "this" is query
  // Same as {secretTour: false}
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();

  next();
});

// Post middleware
tourSchema.post(/^find/, function (docs, next) {
  // Docs are all the documents that are returned from the query
  // Here "this" is query
  console.log(`Query took ${Date.now() - this.start} milliseconds`);

  next();
});

// 3) Aggregation middleware
tourSchema.pre('aggregate', function (next) {
  // Here "this" is the current aggregation object
  // We have to add $match state in the beginning of pipeline (unshift array method) to remove secret tours from aggregation pipeline,
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  next();
});

// Creating the model(collection: Tours) out of schema
const Tour = mongoose.model('Tours', tourSchema);

module.exports = Tour;
