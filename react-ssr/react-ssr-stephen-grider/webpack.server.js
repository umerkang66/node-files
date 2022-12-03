// This configuration will create the code that will be handled and run by node.js
const path = require('path');
const merge = require('webpack-merge');
const webpackNodeExternals = require('webpack-node-externals');
const baseConfig = require('./webpack.base.js');

const config = {
  // Inform webpack that we're building a bundle for node.js, rather than for the browser
  target: 'node',

  // Tell webpack the root file of our server application
  entry: './src/index.js',

  // Tell webpack where to put the output file that is generated
  output: {
    filename: 'bundle.js',
    // In the same directory, in the build folder
    path: path.join(__dirname, 'build'),
  },

  // If the library is in the node_modules folder this will not be included in final bundle.js file: MORE on that in the server index.js file
  externals: [webpackNodeExternals()],
};

module.exports = merge(baseConfig, config);
