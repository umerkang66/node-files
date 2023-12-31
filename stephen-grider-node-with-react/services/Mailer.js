const { htmlToText } = require('html-to-text');
const nodemailer = require('nodemailer');

const keys = require('../config/keys');

// Provide additional customization to the original Mail class
class Mailer {
  verifiedSenderEmail = 'no-reply@emaily.dev';

  constructor(survey, template) {
    const { subject, recipients } = survey;

    this.nodemailer = nodemailer.createTransport({
      service: 'SendinBlue',
      auth: { user: keys.sendInBlueUser, pass: keys.sendInBluePass },
    });

    this.recipients = this.formatRecipients(recipients);

    this.createMessage = to => ({
      to,
      from: this.verifiedSenderEmail,
      subject: subject,
      text: htmlToText(template(survey, to)),
      html: template(survey, to),
    });
  }

  formatRecipients(recipients) {
    // Recipients in the array of objects, that has email property and some other properties, pull out the email property
    return recipients.map(recipient => recipient.email);
  }

  async send() {
    await Promise.all(
      this.recipients.map(rec =>
        this.nodemailer.sendMail(this.createMessage(rec))
      )
    );
  }
}

module.exports = Mailer;
