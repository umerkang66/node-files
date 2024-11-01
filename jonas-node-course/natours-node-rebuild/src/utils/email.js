const path = require('path');
const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');
const rootDir = require('./path');

class Email {
  constructor(user, url) {
    // "user" object is information about user, and "url" like reset url
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Umer Gulzar <${process.env.EMAIL_FROM}>`;
  }

  // 1) Create the transporter
  // Transporter is the server that will send the emails, because it is not node js that send the emails in development it is mail trap, and in production it is sendGrid
  _newTransport() {
    if (process.env.NODE_ENV === 'production') {
      const user = process.env.SEND_IN_BLUE_USERNAME;
      const pass = process.env.SEND_IN_BLUE_PASSWORD;

      if (!user || !pass) {
        // if there are no EMAIL CONFIGURATION
        return null;
      }

      return nodemailer.createTransport({
        // Using sendInBlue (that is also predefined)
        service: 'SendinBlue',
        auth: { user, pass },
      });
    }

    const host = process.env.EMAIL_HOST;
    const port = process.env.EMAIL_PORT;
    const user = process.env.EMAIL_USERNAME;
    const pass = process.env.EMAIL_PASSWORD;

    if (!host || !port || !user || !pass) {
      // if there are no EMAIL CONFIGURATION
      return null;
    }

    return nodemailer.createTransport({
      // From which service send the emails
      // Here we are using MailTrap that will trap the emails in the development environment
      // We have to specify host because, mailtrap is not one the pre defined services for nodemailer
      host,
      port,
      auth: { user, pass },
    });
  }

  // 2) Send the email
  async _send(template, subject) {
    // 1) Render HTML based on the pug template
    const tempPath = path.join(rootDir, 'src/views/email', `${template}.pug`);

    const html = pug.renderFile(tempPath, {
      // Just like res.render, we can pass options,
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define the email options
    const mailOptions = {
      // "from" is where the email is coming from
      from: this.from,
      // To whom we will send the email, that email we will get from options
      to: this.to,
      // Subject of email
      subject,
      // Actually body of email
      html,
      text: htmlToText(html),
    };

    // 3) Create a transport and send email
    const transporter = this._newTransport();
    if (!transporter) {
      // if there are no EMAIL CONFIGURATION
      return null;
    }

    await transporter.sendMail(mailOptions);
  }

  async sendWelcome() {
    await this._send('welcome', 'Welcome to the natours family');
  }

  async sendResetPassword() {
    await this._send(
      'passwordReset',
      'Your password reset token (value for only 10 minutes)'
    );
  }
}

module.exports = Email;
