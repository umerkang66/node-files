const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');

// Importing the Models
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');

// Tell where the config file is located, and get the config file before requiring the app.js file
dotenv.config({ path: `${__dirname}/../../config.env` });

// CONNECTING TO THE DB
// Creating the db connection string
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// const DB_LOCAL = process.env.DATABASE_LOCAL;

mongoose.connect(DB).then(() => console.log('Db connection successful'));

// Read Json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// Import Data into DB
const importData = async () => {
  try {
    // Tour.create can also accept the array of objects
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  // process.exit is aggressive way of stopping node process, which is no problem because this is just basic script
  process.exit();
};

// Delete all Data from collection
const deleteData = async () => {
  try {
    // Tour.create can also accept the array of objects
    // This is going to delete the all the documents in the db.tours
    await Tour.deleteMany({});
    console.log('Data successfully Deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteUser = async () => {
  try {
    // Tour.create can also accept the array of objects
    // This is going to delete the all the documents in the db.tours
    await User.deleteMany({});
    console.log('Users successfully Deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Interacting with the command line
// process.argv is an array where 3rd element is actually what we specified in the terminal after node process
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else if (process.argv[2] === '--delete-users') {
  deleteUser();
}
