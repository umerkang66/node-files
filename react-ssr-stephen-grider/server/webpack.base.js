module.exports = {
  // THIS WILL BE EXTENDED IN BOTH CLIENT AND SERVER WEBPACK CONFIG FILES
  // Tell webpack to run babel on every file it runs through
  module: {
    rules: [
      {
        // Only use files that ends with .js
        test: /\.js?$/,
        // Use babel
        loader: 'babel-loader',
        // Not run babel on these files
        exclude: /node_modules/,
        // Options for babel
        options: {
          // Run these presets
          // stage-0 handles async code
          presets: [
            'react',
            'stage-0',
            [
              // Use all environment variables for last 2 versions of browsers
              'env',
              {
                targets: {
                  browsers: ['last 2 versions'],
                },
              },
            ],
          ],
        },
      },
    ],
  },
};
