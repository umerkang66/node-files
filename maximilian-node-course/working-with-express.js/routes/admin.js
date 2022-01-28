const { Router } = require('express');
const path = require('path');

const router = Router();

router.get('/add-product', (req, res) => {
  // We can also get "next" function but didn't need it, don't use next function in routes, because it will result an error
  res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
});

// router.post is same as router.use but it only filters for post requests
router.post('/product', (req, res) => {
  const { title } = req.body;
  console.log(title);

  res.redirect('/admin/add-product');
});

module.exports = router;
