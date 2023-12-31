jest.setTimeout(120000);

// We have to tell jest that it is a global file, so this will run before every test file, (like blogs.test.js and header.test.js)
require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.connect(keys.mongoURI).then(() => console.log('Connected To DB'));
