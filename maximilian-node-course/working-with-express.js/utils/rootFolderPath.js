const path = require('path');

// require.main.filename: This will give the filename of the path where node scripts executed
// path.dirname: This will return the directory name of file (whatever file that is put in the path.dirname())
// By combining both of these, we will get the root folder of project
const rootFolderPath = path.dirname(require.main.filename);

module.exports = rootFolderPath;
