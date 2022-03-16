const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

const sessionFactory = user => {
  // Create session obj out of userId
  const sessionObj = {
    passport: {
      user: user._id.toString(),
    },
  };

  // Create session
  const session = Buffer.from(JSON.stringify(sessionObj)).toString('base64');

  // Create session signature
  const sig = keygrip.sign('session=' + session);
  return { session, sig };
};

module.exports = sessionFactory;
