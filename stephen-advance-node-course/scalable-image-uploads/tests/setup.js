jest.setTimeout(120000);

// We have to tell jest that it is a global file
require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.connect(keys.mongoURI).then(() => console.log('Connected To DB'));
