import { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

// Components
import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';
import SurveyNew from './surveys/SurveyNew';
import NotFound from './NotFound';

// Actions
import { fetchUser } from '../actions';

const App = ({ fetchUser }) => {
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div className="container">
      <Header />
      {/* See the notes directory for switch and exact */}
      {/* Switch is necessary for NOT FOUND page */}
      <Switch>
        {/* Use exact if the same path in the other routes paths */}
        <Route path="/" exact component={Landing} />
        <Route exact path="/surveys" component={Dashboard} />
        <Route path="/surveys/new" component={SurveyNew} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default connect(null, { fetchUser })(App);
