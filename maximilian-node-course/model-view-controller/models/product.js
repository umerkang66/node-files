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
  constructor(title) {
    this.title = title;
  }

  save(callbackFn) {
    // The callback function that we are getting in the save function should be called when every both write operation is done not read file

    // This is a read file operation that gets callback function will pass the products array (can be empty in case of error)
    getProductsFromFile(products => {
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
}

module.exports = Product;
