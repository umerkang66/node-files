const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const filePath = path.join(rootDir, 'data', 'cart.json');

class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart from "fs"
    fs.readFile(filePath, (err, data) => {
      let cart = { products: [], totalPrice: 0 };

      // If we have error we can use the above cart, If we don't have an error, we can use the cart from file system
      if (!err) cart = JSON.parse(data);

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
}

module.exports = Cart;
