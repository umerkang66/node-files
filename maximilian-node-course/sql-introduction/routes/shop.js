const express = require('express');
const shopControllers = require('../controllers/shop');

const router = express.Router();

router.get('/', shopControllers.getIndex);
router.get('/products', shopControllers.getProducts);

// After adding colon we can add any name of our choice, and if we have a route like "/product/delete", this is not a dynamic route, we have to put delete route above the dynamic route, because order matters
router.get('/products/:productId', shopControllers.getProduct);

router.get('/cart', shopControllers.getCart);
// This will run when add to cart button hits in the frontend
router.post('/cart', shopControllers.postCart);
// Deleting the cart
router.post('/cart-delete-item', shopControllers.postCartDelete);

router.get('/checkout', shopControllers.getCheckout);
router.get('/orders', shopControllers.getOrders);

module.exports = router;
