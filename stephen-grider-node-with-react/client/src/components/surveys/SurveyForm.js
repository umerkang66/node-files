// SurveyForm shows a form for a user to add input
import { Link } from 'react-router-dom';
import { reduxForm, Field } from 'redux-form';
import validateEmails from '../../utils/validateEmails';
import SurveyField from './SurveyField';
import { FIELDS } from './formFields';

// "reduxForm" allows the form to communicate with redux store
const SurveyForm = ({ handleSubmit, onSurveySubmit }) => {
  // handleSubmit comes from reduxForm

  const renderFields = () => {
    return FIELDS.map(({ label, name }) => (
      <Field
        key={name}
        label={label}
        type="text"
        name={name}
        component={SurveyField}
      />
    ));
  };

  return (
    <div>
      <form
        style={{ marginTop: '80px' }}
        onSubmit={handleSubmit(onSurveySubmit)}
      >
        {renderFields()}

        <Link to="/surveys" className="red btn white-text">
          Cancel
        </Link>

        <button type="submit" className="teal btn right white-text">
          Next
          <i className="material-icons right">done</i>
        </button>
      </form>
    </div>
  );
};

const validate = values => {
  // Values will all the form values in the form
  const errors = {};

  errors.recipients = validateEmails(values.recipients || '');

  FIELDS.forEach(({ name }) => {
    // If user doesn't provide the value in input form, then run this code right here
    if (!values[name]) {
      errors[name] = `You must provide a ${name}`;
    }
  });

  // Redux-form will pass the error object to the same field in the form with the name of the error i.e. "error.title" will be passed to the field that has name "title"

  // If errors object is empty redux-form will consider that entire form is valid
  return errors;
};

export default reduxForm({
  // This form name will hold the state in the redux. i.e. state.form.surveyForm
  form: 'surveyForm',
  validate,
  // Don't delete the form values when the component is unmounted
  destroyOnUnmount: false,
})(SurveyForm);
