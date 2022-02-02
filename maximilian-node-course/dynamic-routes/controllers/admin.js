const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.getEditProduct = (req, res, next) => {
  // req.query object is created by express if there are any parameters after "?" in the url, that can be distributed by "&"
  // The extracted values from req.query are strings, so it will be "true" instead of true
  const { edit } = req.query;
  // Make sure to return the response
  if (!edit) return res.redirect('/');

  const { productId } = req.params;
  Product.findById(productId, product => {
    if (!product) return res.redirect('/');

    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: edit,
      product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body;

  const product = new Product(productId, title, imageUrl, description, price);

  product.save(err => {
    if (err) {
      return res.status(404).render('404', {
        pageTitle: 'Cannot Edit file',
        path: '/',
      });
    }

    res.redirect(`/admin/products`);
  });
};

exports.deleteProduct = (req, res, next) => {
  const { productId } = req.params;

  Product.deleteById(productId, err => {
    if (err) {
      return res.status(404).render('404', {
        pageTitle: 'Cannot Delete file',
        path: '/',
      });
    }

    res.redirect(`/admin/products`);
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;

  // We need to pass null as first option because because it is "id", and we don't have "id" when we are creating the new product, "id" only exists when we need to update the product
  const product = new Product(null, title, imageUrl, description, price);

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
