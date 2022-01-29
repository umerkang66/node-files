const { Router } = require('express');
const path = require('path');

const rootFolderPath = require('../utils/rootFolderPath');

const router = Router();

router.get('/add-product', (req, res) => {
  res.render('add-product', {
    title: 'Add product',
    path: '/admin/add-product',
  });
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
