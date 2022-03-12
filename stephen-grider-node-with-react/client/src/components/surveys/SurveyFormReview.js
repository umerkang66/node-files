import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { FIELDS } from './formFields';

import { submitSurvey } from '../../actions';

const SurveyFormReview = ({ onCancel, formValues, submitSurvey }) => {
  const history = useHistory();
  const [submitBtnValue, setSubmitBtnValue] = useState('Send Survey');

  const renderReviewFields = () => {
    return FIELDS.map(({ label, name }) => {
      return (
        <div key={name}>
          <label style={{ fontSize: '16px' }}>{label}</label>
          <div>{formValues[name]}</div>
        </div>
      );
    });
  };

  return (
    <div>
      <h4>Please confirm your entries</h4>

      <div style={{ margin: '50px 0' }}>{renderReviewFields()}</div>

      <button className="yellow darken-3 btn" onClick={onCancel}>
        Back
      </button>

      <button
        onClick={() => submitSurvey(formValues, history, setSubmitBtnValue)}
        className="green btn right"
      >
        {submitBtnValue}
        <i className="material-icons right">email</i>
      </button>
    </div>
  );
};

const mapStateToProps = ({ form }) => {
  // form state has surveyForm property that has been specified in the surveyForm, where redux form is connected to SurveyForm component
  return { formValues: form.surveyForm.values };
};

export default connect(mapStateToProps, { submitSurvey })(SurveyFormReview);
