module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>Enter message</title></head>');
  res.write(
    '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Submit</button></form></body>'
  );
  res.write('</html>');

  return res.end();
};
