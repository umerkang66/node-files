const mongoose = require('mongoose');

// We can specify the fields of a document, validate them, and also specify some error message
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    // Every name should be unique
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

// Creating the model(collection: Tours) out of schema
const Tour = mongoose.model('Tours', tourSchema);

module.exports = Tour;
