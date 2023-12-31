// arguments is an array in js, that contains all the arguments that was passed into a function
// If we see some values here in the console, it means we are actually in a function (that is actually IIFE, that node wraps this module automatically)

console.log(arguments);
console.log(require('module').wrapper);

/*
const calculator = require('./modules/test-module-1');
console.log(calculator.add(3, 5));

require('./modules/module-cache')();
require('./modules/module-cache')();
require('./modules/module-cache')();
*/

// The Below is the result of arguments console in the console

// The first one is exports object (that is empty because we are not exporting anything)

// The second one is require function

// The Third one is module itself

// The Fourth one is absolute path of file

// The Fifth one is absolute path of directory where the file is actually located

// NOTE IMPORTANT!: If we use "./" or "../" to specify path, they will not start from the where is file located, but they will start from where the node script is executed, that is the root directory of the project

/*
{
  '0': {},
  '1': [Function: require] {
    resolve: [Function: resolve] { paths: [Function: paths] },
    main: Module {
      id: '.',      path: 'C:\\Users\\ugulz\\Downloads\\dev-files\\completed-projects\\node-files\\jonas-node-course\\how-node-works\\code',
      exports: {},
      filename: 'C:\\Users\\ugulz\\Downloads\\dev-files\\completed-projects\\node-files\\jonas-node-course\\how-node-works\\code\\modules.js',      
      loaded: false,
      children: [],
      paths: [Array]
    },
    extensions: [Object: null prototype] {
      '.js': [Function (anonymous)],
      '.json': [Function (anonymous)],
      '.node': [Function (anonymous)]
    },
    cache: [Object: null prototype] {
      'C:\\Users\\ugulz\\Downloads\\dev-files\\completed-projects\\node-files\\jonas-node-course\\how-node-works\\code\\modules.js': [Module]       
    }
  },
  '2': Module {
    id: '.',
    path: 'C:\\Users\\ugulz\\Downloads\\dev-files\\completed-projects\\node-files\\jonas-node-course\\how-node-works\\code',
    exports: {},
    filename: 'C:\\Users\\ugulz\\Downloads\\dev-files\\completed-projects\\node-files\\jonas-node-course\\how-node-works\\code\\modules.js',        
    loaded: false,
    children: [],
    paths: [
      'C:\\Users\\ugulz\\Downloads\\dev-files\\completed-projects\\node-files\\jonas-node-course\\how-node-works\\code\\node_modules',
      'C:\\Users\\ugulz\\Downloads\\dev-files\\completed-projects\\node-files\\jonas-node-course\\how-node-works\\node_modules',
      'C:\\Users\\ugulz\\Downloads\\dev-files\\completed-projects\\node-files\\jonas-node-course\\node_modules',
      'C:\\Users\\ugulz\\Downloads\\dev-files\\completed-projects\\node-files\\node_modules',
      'C:\\Users\\ugulz\\Downloads\\dev-files\\completed-projects\\node_modules',
      'C:\\Users\\ugulz\\Downloads\\dev-files\\node_modules',
      'C:\\Users\\ugulz\\Downloads\\node_modules',
      'C:\\Users\\ugulz\\node_modules',
      'C:\\Users\\node_modules',
      'C:\\node_modules'
    ]
  },
  '3': 'C:\\Users\\ugulz\\Downloads\\dev-files\\completed-projects\\node-files\\jonas-node-course\\how-node-works\\code\\modules.js',
  '4': 'C:\\Users\\ugulz\\Downloads\\dev-files\\completed-projects\\node-files\\jonas-node-course\\how-node-works\\code'
}
*/
