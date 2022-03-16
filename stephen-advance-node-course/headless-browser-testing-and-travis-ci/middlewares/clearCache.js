const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
  // Dump the cash after we created the record successfully
  // Run the next handler then run this middleware
  await next();

  await clearHash(req.user.id);
};
