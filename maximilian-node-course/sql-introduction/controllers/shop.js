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
  Cart.getCart((err, cart) => {
    if (err) {
      return res.status(404).render('404', {
        pageTitle: 'Cannot Find Cart',
        path: '/',
      });
    }

    // Fetching all products
    Product.fetchAll(products => {
      const cartProducts = [];

      for (const product of products) {
        const cartProdData = cart.products.find(prod => prod.id === product.id);

        if (cartProdData) {
          cartProducts.push({ productData: product, qty: cartProdData.qty });
        }
      }

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, product => {
    Cart.addProduct(productId, product.price);
  });

  res.redirect('/');
};

exports.postCartDelete = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId, product => {
    Cart.deleteById(productId, product.price, err => {
      if (err) {
        return res.status(404).render('404', {
          pageTitle: 'Cannot Find Cart',
          path: '/',
        });
      }

      res.redirect('/cart');
    });
  });
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
