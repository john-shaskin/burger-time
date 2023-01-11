import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

const checkout = props => {
  const checkoutCanceledHandler = () => {
    props.history.goBack();
  }

  const checkoutContinueHandler = () => {
    props.history.replace('/checkout/contact-data');
  }

  let summary = <Redirect to="/" />;
  if (props.ings) {
    const purchasedRedirect = props.ordered ? <Redirect to="/" /> : null;
    summary = (
      <div>
        {purchasedRedirect}
        <CheckoutSummary
          ingredients={props.ings}
          checkoutCanceled={checkoutCanceledHandler}
          checkoutContinue={checkoutContinueHandler} />
        <Route path={props.match.path + '/contact-data'}
          component={ContactData} />
      </div>
    )
  }
  return summary;
}

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    ordered: state.order.ordered,
  }
}

export default connect(mapStateToProps)(checkout);
