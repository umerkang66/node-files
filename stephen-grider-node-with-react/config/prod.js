/* module.exports = {
  googleClientId:
    '639255333427-f03ulj9hnmc6tm9n4s6jhehlo0cumnc8.apps.googleusercontent.com',
  googleClientSecret: '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',
  mongoUri:
    'mongodb+srv://ugulzar4512:ugulzar4512@cluster0.526zy.mongodb.net/emaily?retryWrites=true&w=majority',
  cookieKey: 'super super secure cookie key by umer kang',
}; */

module.exports = {
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  mongoUri: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY,
};
