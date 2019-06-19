import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
  checkoutCanceledHandler = () => {
    this.props.history.goBack();
  }

  checkoutContinueHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  }

  render() {
    let checkoutSummary = <Spinner />;
    if (this.props.ings) {
      checkoutSummary = (
        <CheckoutSummary
          ingredients={this.props.ings}
          checkoutCanceled={this.checkoutCanceledHandler}
          checkoutContinue={this.checkoutContinueHandler} />
      )
    }
    return (
      <div>
        {checkoutSummary}
        <Route path={this.props.match.path + '/contact-data'}
        component={ContactData} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.ingredients,
    price: state.totalPrice,
  }
}

export default connect(mapStateToProps)(Checkout);
