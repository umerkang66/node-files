const keys = require('../../config/keys');

const surveyTemplate = (survey, to) => {
  return `
    <html>
      <body>
        <div style="text-align: center;">
          <h3>I'd like your input!</h3>
          <p>Please answer the following question:</p>
          <p>${survey.body}</p>
          <div>
            <a href="${keys.redirectDomain}/api/surveys/${survey.id}/yes?email=${to}">Yes</a>
          </div>
          <div>
            <a href="${keys.redirectDomain}/api/surveys/${survey.id}/no?email=${to}">No</a>
          </div>
        </div>
      </body>
    </html>
  `;
};

module.exports = surveyTemplate;
