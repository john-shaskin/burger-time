import React, { Component } from 'react';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import Spinner from '../../components/UI/Spinner/Spinner';

class Checkout extends Component {
  state = {
    ingredients: null,
  };

  componentDidMount() {
    this.loadIngredientsFromSearch();
  }

  componentDidUpdate() {
    this.loadIngredientsFromSearch();
  }

  loadIngredientsFromSearch() {
    const query = new URLSearchParams(this.props.history.location.search);
    if (this.state.ingredients === null) {
      let stuff = {}
      for (var entry of query.entries()) {
          const key = entry[0];
          stuff[key] = Number.parseInt(entry[1]);
      }
      this.setState({ ingredients: stuff });
    }
  }

  checkoutCanceledHandler = () => {
    this.props.history.goBack();
  }

  checkoutContinueHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  }

  render() {
    let checkoutSummary = <Spinner />;
    if (this.state.ingredients) {
      checkoutSummary = (
        <CheckoutSummary
          ingredients={this.state.ingredients}
          checkoutCanceled={this.checkoutCanceledHandler}
          checkoutContinue={this.checkoutContinueHandler} />
      )
    }
    return (
      <div>
        {checkoutSummary}
      </div>
    )
  }
}

export default Checkout;
