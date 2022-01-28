const { Router } = require('express');
const path = require('path');

const rootFolderPath = require('../utils/rootFolderPath');

const router = Router();

router.get('/', (req, res, next) => {
  // We can also set our "Content-Type" header, express will not set it itself, if we explicity set it
  // res.setHeader('Content-Type', 'text/html');
  // Regular path does not work, because of the different operating systems, we have to use path.join method
  // __dirname gives us where the path is currently exists
  res.sendFile(path.join(rootFolderPath, 'views', 'shop.html'));
  // We don't have to use next because it will clash with other response
});

module.exports = router;
