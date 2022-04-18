const sgMail = require('@sendgrid/mail');
const { htmlToText } = require('html-to-text');

const keys = require('../config/keys');

// Provide additional customization to the original Mail class
class Mailer {
  verifiedSenderEmail = 'umerkang77@gmail.com';

  constructor({ subject, recipients }, content) {
    this.sgMail = sgMail.setApiKey(keys.sendGridKey);
    this.msg = {
      to: this.formatRecipients(recipients),
      from: this.verifiedSenderEmail,
      subject: subject,
      text: htmlToText(content),
      html: content,
      trackingSettings: {
        clickTracking: {
          enable: true,
          enableText: true,
        },
      },
    };
  }

  formatRecipients(recipients) {
    // Recipients in the array of objects, that has email property and some other properties, pull out the email property
    return recipients.map(recipient => recipient.email);
  }

  async send() {
    const response = await this.sgMail.send(this.msg);
    return response;
  }
}

module.exports = Mailer;
