const { Router } = require('express');
const path = require('path');

const rootFolderPath = require('../utils/rootFolderPath');

const router = Router();

router.get('/add-product', (req, res) => {
  // We can also get "next" function but didn't need it, don't use next function in routes, because it will result an error
  res.sendFile(path.join(rootFolderPath, 'views', 'add-product.html'));
});

const products = [];

// router.post is same as router.use but it only filters for post requests
router.post('/add-product', (req, res) => {
  const { title } = req.body;
  if (title) products.push({ title });

  // Redirecting to the root page
  res.redirect('/');
});

exports.products = products;
exports.adminRoutes = router;
