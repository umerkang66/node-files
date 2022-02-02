const express = require('express');

const adminControllers = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
// This will handle the return of add-product page (that has add-product form)
router.get('/add-product', adminControllers.getAddProduct);

// /admin/product => GET
router.get('/products', adminControllers.getProducts);

// /admin/add-product => POST
// This will handle the post request page of
router.post('/add-product', adminControllers.postAddProduct);

// Edit product Page
router.get('/edit-product/:productId', adminControllers.getEditProduct);
// Edit Product Post Router
router.post('/edit-product/:productId', adminControllers.postEditProduct);

module.exports = router;
