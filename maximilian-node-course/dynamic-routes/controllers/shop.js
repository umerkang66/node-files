const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    });
  });
};

exports.getProduct = (req, res, next) => {
  // Because this middleware function will run in the dynamic route, Hence we can access the dynamic id that is being passed in the url. Here we can use the productId because we have used in the dynamic route as dynamic id
  const { productId } = req.params;
  Product.findById(productId, product => {
    res.render('shop/product-detail', {
      pageTitle: product.title,
      path: '/product',
      product,
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop Index',
      path: '/',
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/index', {
    path: '/cart',
    pageTitle: 'Your Cart',
  });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, product => {
    Cart.addProduct(productId, product.price);
  });

  res.redirect('/');
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Cart',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};
