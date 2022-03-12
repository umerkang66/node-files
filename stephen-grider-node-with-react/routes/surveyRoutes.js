const _ = require('lodash');
const mongoose = require('mongoose');
const { Path } = require('path-parser');
const { URL } = require('url');

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
    res.send('Thanks for voting!!');
  });

  app.post('/api/surveys/webhooks', (req, res) => {
    const p = new Path('/api/surveys/:surveyId/:choice');

    // Get the array of objects that will have user email, surveyId (which email is clicked), and choice (yes, or no)
    const events = req.body.map(({ email, url }) => {
      // 1) Get the pathname (after the protocol and host)
      const pathname = new URL(url).pathname;
      // 2) Extract surveyId and choice (yes, no)
      const match = p.test(pathname);

      // "match" can also be null
      if (match) {
        return {
          email,
          surveyId: match.surveyId,
          choice: match.choice,
        };
      }
    });

    // Compact function will remove all the falsy values
    const compactEvents = _.compact(events);
    // If there are multiple values with email, and surveyId, just remove the duplicates
    // This will compare with both email, and surveyId, if same email but different surveyIds, it will not considered as duplicate
    const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId');

    // Updating the in DB, we don't have to await anything
    uniqueEvents.forEach(({ surveyId, email, choice }) => {
      Survey.updateOne(
        {
          _id: surveyId,
          recipients: {
            $elemMatch: { email, responded: false },
          },
        },
        {
          $inc: { [choice]: 1 },
          $set: { 'recipients.$.responded': true },
          lastResponded: new Date(),
        }
      ).exec();
    });

    res.send({});
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
