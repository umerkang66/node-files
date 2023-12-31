const mongoose = require('mongoose');
const recipientSchema = require('./Recipient');

const surveySchema = new mongoose.Schema({
  title: String,
  body: String,
  subject: String,
  recipients: [recipientSchema],
  // Answer received from the user
  yes: {
    type: Number,
    default: 0,
  },
  no: {
    type: Number,
    default: 0,
  },
  _user: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
  },
  // To check if the survey is active.
  // If last responded date way less, then it means the survey is inactive
  dateSent: Date,
  lastResponded: Date,
});

mongoose.model('surveys', surveySchema);
