const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const filePath = path.join(rootDir, 'data', 'cart.json');

const getCartFromFile = callbackFn => {
  fs.readFile(filePath, 'utf-8', (err, dataJson) => {
    if (err) return callbackFn(err);

    const cart = JSON.parse(dataJson);
    // First will be error, and second will be cart object
    callbackFn(null, cart);
  });
};

class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart from "fs"
    getCartFromFile((err, data) => {
      let cart = { products: [], totalPrice: 0 };

      // If we have error we can use the above cart, If we don't have an error, we can use the cart from file system
      if (!err) cart = data;

      // Analyze the cart ==> find existing product
      const existingProductIndex = cart.products.findIndex(p => p.id === id);
      const existingProduct = cart.products[existingProductIndex];

      let updatedProduct;
      if (existingProduct) {
        // Creating a new updated product here
        updatedProduct = { ...existingProduct };
        // If product already exists, increase the quantity
        updatedProduct.qty += 1;

        // Add all the previous cart items
        cart.products = [...cart.products];

        // We cannot add it as the new item, but we have to find the index of that existing item in the array, and update it with updated item
        // At the current position (index of existing product) add new updatedProduct
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        // Product does not exist in the cart
        updatedProduct = { id, qty: 1 };
        // Update the original cart, we can simply add it as a new item because it does not exist in the array
        cart.products = [...cart.products, updatedProduct];
      }

      // Price will be added if or if not product exists in the cart products array
      // Make sure to convert the price into a number
      cart.totalPrice += +productPrice;

      // Write the file to the file system
      fs.writeFile(filePath, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static deleteById(id, productPrice, callbackFn) {
    getCartFromFile((err, cart) => {
      if (err) callbackFn(err.message || 'Something went wrong');

      const cartProdToBeDel = cart.products.find(prod => prod.id === id);

      if (!cartProdToBeDel) {
        return;
      }

      const updatedCartProducts = cart.products.filter(prod => prod.id !== id);

      const priceToReduce = productPrice * cartProdToBeDel.qty;

      cart.products = updatedCartProducts;
      cart.totalPrice -= priceToReduce;

      // Writing the file
      fs.writeFile(filePath, JSON.stringify(cart), err => {
        if (err) callbackFn(err.message || 'Something went wrong');

        callbackFn();
      });
    });
  }

  static getCart(callbackFn) {
    getCartFromFile((err, data) => {
      if (err) return callbackFn(err);

      // Here data is cart, here null is error
      callbackFn(null, data);
    });
  }
}

module.exports = Cart;
