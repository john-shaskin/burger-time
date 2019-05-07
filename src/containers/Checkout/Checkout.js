import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
  state = {
    ingredients: null,
    totalPrice: 0,
  };

  componentWillMount() {
    this.loadIngredientsFromSearch();
  }

  componentDidUpdate() {
    this.loadIngredientsFromSearch();
  }

  loadIngredientsFromSearch() {
    const query = new URLSearchParams(this.props.history.location.search);
    if (this.state.ingredients === null) {
      let stuff = {}
      let price = 0;
      for (var entry of query.entries()) {
        if (entry[0] === 'price') {
          price = Number.parseInt(entry[1]);
        }
        else {
          const key = entry[0];
          stuff[key] = Number.parseInt(entry[1]);
        }
      }
      this.setState({ ingredients: stuff, totalPrice: price });
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
        <Route path={this.props.match.path + '/contact-data'}
        render={(props) => (<ContactData ingredients={this.state.ingredients} price={this.state.totalPrice} {...props} />)} />
      </div>
    )
  }
}

export default Checkout;
