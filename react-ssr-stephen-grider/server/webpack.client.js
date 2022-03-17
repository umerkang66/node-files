// This configuration will create the code that will be handled and run by browser (like static javascript file)
const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

const config = {
  // remove the "target" because automatically it will bundle for browser
  // target: 'node',

  // Tell webpack the root file of our server application
  entry: './src/client/client.js',

  // Tell webpack where to put the output file that is generated
  output: {
    filename: 'bundle.js',
    // In the same directory, in the public folder, because all the static files will live in the public folder
    path: path.join(__dirname, 'public'),
  },
};

module.exports = merge(baseConfig, config);
