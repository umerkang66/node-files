const AWS = require('aws-sdk');
const uuid = require('uuid/v1');

const keys = require('../config/keys');
const requireLogin = require('../middlewares/requireLogin');

const s3 = new AWS.S3({
  accessKeyId: keys.s3AccessKeyId,
  secretAccessKey: keys.s3SecretAccessKeyId,
  region: 'ap-south-1',
});

module.exports = app => {
  app.get('/api/upload', requireLogin, (req, res) => {
    // Filename: "/" will act as fake folder (there are no folders in amazon s3)
    const key = `${req.user.id}/${uuid()}.jpeg`;

    // Operation name for uploading a new file is "putObject"
    s3.getSignedUrl(
      'putObject',
      {
        Bucket: 'blogster-image-bucket-umer',
        ContentType: 'image/jpeg',
        Key: key,
      },
      (err, url) => {
        res.send({ key, url });
      }
    );
  });
};
