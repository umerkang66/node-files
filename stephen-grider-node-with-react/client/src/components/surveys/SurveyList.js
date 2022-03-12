import { useEffect } from 'react';
import { connect } from 'react-redux';

import { fetchSurveys } from '../../actions';

const SurveyList = ({ surveys, fetchSurveys }) => {
  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  const renderSurveys = () => {
    return surveys.reverse().map(survey => {
      return (
        <div key={survey._id} className="card blue-grey darken-1">
          <div className="card-content" style={{ color: 'white' }}>
            <span className="card-title">{survey.title}</span>
            <p>{survey.body}</p>
            <p className="right">
              Sent On: {new Date(survey.dateSent).toLocaleDateString()}
            </p>
          </div>
          <div
            className="card-action"
            style={{ color: '#ccf062', display: 'flex' }}
          >
            <div style={{ marginRight: '10px' }}>Yes: {survey.yes}</div>
            <div>No: {survey.no}</div>
          </div>
        </div>
      );
    });
  };

  return <div>{renderSurveys()}</div>;
};

const mapStateToProps = ({ surveys }) => {
  return { surveys };
};

export default connect(mapStateToProps, { fetchSurveys })(SurveyList);
