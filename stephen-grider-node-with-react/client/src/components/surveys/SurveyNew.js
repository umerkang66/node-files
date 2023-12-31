// SurveyNew shows SurveyForm and SurveyFormReview

import { useState } from 'react';
import { reduxForm } from 'redux-form';

import SurveyForm from './SurveyForm';
import SurveyFormReview from './SurveyFormReview';

const SurveyNew = () => {
  const [showSurveyFormReview, setShowSurveyFormReview] = useState(false);

  return (
    <div>
      {showSurveyFormReview ? (
        <SurveyFormReview onCancel={() => setShowSurveyFormReview(false)} />
      ) : (
        <SurveyForm onSurveySubmit={() => setShowSurveyFormReview(true)} />
      )}
    </div>
  );
};

// This is for dumping the values inside SurveyForm component
// In the SurveyForm we add the settings to not dump the values, if SurveyForm component is unmounted, but here we are saying that when this SurveyNew component is unmounted, then dump the values, because that is the default behavior
// Values will only be dump if this component is unmounted, that doesn't happen when toggling between SURVEY_FORM and SURVEY_FORM_REVIEW components
export default reduxForm({
  // IMP! use the same form name
  form: 'surveyForm',
})(SurveyNew);
