const { Router } = require('express');
const path = require('path');

const rootFolderPath = require('../utils/rootFolderPath');
const { products } = require('./admin');

const router = Router();

router.get('/', (req, res, next) => {
  // Render method will automatically find in the views folder because we can set in the main express application, or it is also default, we also don't have to write ".pug" files
  // Render method also set the headers like Content-Type automatically
  // We can set the second argument (that is object) and pass them to the pug file
  // Also these views will be generated on the fly
  res.render('shop', { products, title: 'Shop', path: '/' });
});

module.exports = router;
