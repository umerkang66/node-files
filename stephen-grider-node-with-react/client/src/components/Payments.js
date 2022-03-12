import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';

import { handleToken } from '../actions';

const Payments = ({ handleToken, auth }) => {
  const sendToken = token => {
    // redux action
    handleToken(token);
  };

  // Amount should be in cents
  // Token call the callback, when token is received
  return (
    <StripeCheckout
      amount={500}
      token={sendToken}
      stripeKey={process.env.REACT_APP_STRIPE_KEY}
      name="Emaily"
      description="$5 for 5 email credits"
      email={auth.email}
    >
      {/* For custom button */}
      <button
        style={{
          color: '#333',
          fontWeight: 'bold',
          backgroundColor: '#99d63c',
          boxShadow: '0 0',
        }}
        className="btn"
      >
        Add Credits
      </button>
    </StripeCheckout>
  );
};

const mapStateToProps = state => {
  return { auth: state.auth };
};

export default connect(mapStateToProps, { handleToken })(Payments);
