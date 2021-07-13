const http = require('http');
const url = require('url');
const fs = require('fs');

const replaceTemplate = require('./modules/replaceTemplate');

/////////////////////////////////
// FILES

/*
// BLOCKING, SYNCHROUNOUS WAY
const textInput = fs.readFileSync('./txt/input.txt', 'utf-8');
const textOutput = `This is what we know about the avacado: ${textInput}\nCreated on ${new Date().toLocaleString()}`;
fs.writeFileSync('./txt/output.txt', textOutput);

// NON-BLOCKING, ASYNCHRONOUS WAY
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
  if (err) throw new Error(err.message);
  fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
    if (err) throw new Error(err.message);
    fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
      if (err) throw new Error(err.message);
      fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, err => {
        if (err) throw new Error(err.message);
        console.log('Your file has been written 😃😃😃');
      });
    });
  });
});
*/

/////////////////////////////////
// SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const dataJson = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(dataJson);

const server = http.createServer((req, res) => {
  // prettier-ignore
  const { query: { id }, pathname } = url.parse(req.url, true);

  // OVERVIEW PAGE
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = dataObj
      .map(data => replaceTemplate(tempCard, data))
      .join('');

    const output = tempOverview.replace('{$PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    // PRODUCT PAGE
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(dataJson);

    // NOT FOUND
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>This page could not be found</h1>');
  }
});

server.listen('8000', '127.0.0.1', () => {
  console.log('Listening to requests to port 8000');
});
