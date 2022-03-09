import { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

// Components
import Header from './Header';
import Landing from './Landing';
// Actions
import { fetchUser } from '../actions';

const Dashboard = () => <h2>Dashboard</h2>;
const SurveyNew = () => <h2>SurveyNew</h2>;
const NotFound = () => <h2>404 PAGE NOT FOUND</h2>;

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
