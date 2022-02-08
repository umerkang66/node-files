module.exports = (req, res) => {
  // This will done for any url
  res.setHeader('Content-Type', 'text/html');

  res.write('<html>');
  res.write('<head><title>Page from Node Js</title></head>');
  res.write('<body><h1>This is the random page from node js</h1></body>');
  res.write('</html>');

  res.end();
};
