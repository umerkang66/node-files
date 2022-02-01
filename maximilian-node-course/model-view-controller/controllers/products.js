const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

exports.addProduct = (req, res, next) => {
  const { title } = req.body;
  const product = new Product(title);

  // We have to pass the callback function
  product.save(err => {
    if (err) {
      return res.status(404).render('404', {
        pageTitle: 'Cannot Save file',
        path: '/',
      });
    }

    res.redirect('/');
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};
