const _ = require('lodash');
const mongoose = require('mongoose');

const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

const surveyRoutes = app => {
  // Get all the surveys of the current user
  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: 0,
    });

    res.send(surveys);
  });

  // When user will give feedback from email this will run
  app.get('/api/surveys/:surveyId/:response', (req, res) => {
    const { surveyId, response } = req.params;
    const { email } = req.query;

    Survey.updateOne(
      {
        _id: surveyId,
        recipients: {
          $elemMatch: { email, responded: false },
        },
      },
      {
        $inc: { [response]: 1 },
        $set: { 'recipients.$.responded': true },
        lastResponded: Date.now(),
      }
    ).exec();

    res.send('<h1>Thanks for voting!!</h1>');
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now(),
    });

    // Create the emails
    const mailer = new Mailer(survey, surveyTemplate);

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
      console.log(err);
      // 422 means unprocessable entity
      res.status(422).send(err);
    }
  });
};

module.exports = surveyRoutes;
