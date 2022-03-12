const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

const surveyRoutes = app => {
  // When user will give feedback from email this will run
  app.get('/api/surveys/thanks', (req, res) => {
    res.send('Thanks for voting!!');
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email })),
      _user: req.user.id,
      dateSent: Date.now(),
    });

    // Create the emails
    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      // Send the email
      await mailer.send();
      // Save the record
      await survey.save();
      // Remove one credit and the user
      req.user.credits -= 1;
      const user = await req.user.save();

      // Send the user to update the credit
      res.send(user);
    } catch (err) {
      // 422 means unprocessable entity
      res.status(422).send(err);
    }
  });
};

module.exports = surveyRoutes;
