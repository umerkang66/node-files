const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;

  const product = new Product(title, imageUrl, description, price);

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
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  });
};
