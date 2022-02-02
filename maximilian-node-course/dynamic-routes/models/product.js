const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const filePath = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = callbackFn => {
  fs.readFile(filePath, 'utf-8', (err, dataJson) => {
    if (err) return callbackFn([]);

    const products = JSON.parse(dataJson);
    callbackFn(products);
  });
};

class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save(callbackFn) {
    // The callback function that we are getting in the save function should be called when every both write operation is done not read file

    // This is a read file operation that gets callback function will pass the products array (can be empty in case of error)
    getProductsFromFile(products => {
      // Here we have to update the products
      if (this.id) {
        const existingProductIndex = products.findIndex(p => p.id === this.id);
        const updatedProducts = [...products];
        // Replacing existing product with updated product (which is "this")
        updatedProducts[existingProductIndex] = this;

        // IMPORTANT! Make sure to return it because
        // Write the file with appropriate products array
        return fs.writeFile(filePath, JSON.stringify(updatedProducts), err => {
          if (err) {
            // This callback function will redirect to the main page
            return callbackFn(err.message || 'Something went wrong');
          }

          // This callback function will redirect to the main page
          callbackFn();
        });
      }

      // Before saving add the id (dummy id for now)
      this.id = Math.random().toString();

      // We specifically have to use the arrow function as callback function because "this" will lose its content and becomes fs module
      products.push(this);

      fs.writeFile(filePath, JSON.stringify(products), err => {
        if (err) {
          // This callback function will redirect to the main page
          return callbackFn(err.message || 'Something went wrong');
        }

        // This callback function will redirect to the main page
        callbackFn();
      });
    });
  }

  static fetchAll(callbackFn) {
    getProductsFromFile(callbackFn);
  }

  static findById(id, callbackFn) {
    getProductsFromFile(products => {
      if (products instanceof Array) {
        const foundProduct = products.find(p => p.id === id);

        callbackFn(foundProduct);
      }
    });
  }
}

module.exports = Product;
