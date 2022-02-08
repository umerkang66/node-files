module.exports = parsedBody => {
  const data = parsedBody.split('=');
  const message = data[1];

  return message.split('+').join(' ');
};
