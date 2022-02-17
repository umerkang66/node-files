const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter
  // Transporter is the server that will send the emails, because it is not node js that send the emails
  const transporter = nodemailer.createTransport({
    // From which service send the emails
    // Here we are using MailTrap that will trap the emails in the development environment
    // We have to specify host because, mailtrap is not one the pre defined services for nodemailer
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    // "from" is where the email is coming from
    from: 'Umer Gulzar <ugulzar4512@gmail.com>',
    // To whom we will send the email, that email we will get from options
    to: options.email,
    // Subject of email
    subject: options.subject,
    // Actually body of email
    text: options.message,
    // html:
  };

  // 3) Actually send the email, with the mailOptions
  // Send mail will return promise
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
