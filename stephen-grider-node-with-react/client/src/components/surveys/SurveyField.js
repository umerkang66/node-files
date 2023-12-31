// SurveyField contains logic to render a single label and text input

const SurveyField = ({ input, label, meta: { touched, error } }) => {
  // Name tells form reducer that one field is surveyTitle

  // Adding event handlers from redux form, and wiring up to the input of this component
  return (
    <div>
      <label style={{ fontSize: '16px' }}>{label}</label>
      <input {...input} style={{ marginBottom: '5px' }} />
      <div className="red-text" style={{ marginBottom: '20px' }}>
        {touched && error}
      </div>
    </div>
  );
};

export default SurveyField;
