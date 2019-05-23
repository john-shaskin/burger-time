import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';

class ContactData extends Component {
  state = {
    name: '',
    email: '',
    address: {
      street: '',
      postalCode: '',
    },
    loading: false,
  }

  orderHandler = (event) => {
    event.preventDefault();

    this.setState({ loading: true });
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      customer: {
        name: 'The Dude',
        address: {
          street: '123 Faker Street',
          postal: 'H2H7I8',
          country: 'Canadia',
        },
        email: 'jimmy@jimmysonsandsons.com',
      },
      deliveryMethod: 'rowboat',
    };
    axios.post('/orders.json', order)
      .then(response => {
        this.setState({ loading: false });
        this.props.history.push('/');
      })
      .catch(err => {
        this.setState({ loading: false });
      });
  }

  render() {
    let form = (
      <form>
          <input className={classes.Input} type="text" name="name" placeholder="Your name" />
          <input className={classes.Input} type="text" name="email" placeholder="Your email" />
          <input className={classes.Input} type="text" name="street" placeholder="Your street" />
          <input className={classes.Input} type="text" name="postalCode" placeholder="Your postal code" />
          <input className={classes.Input} type="text" name="country" placeholder="Your postal country" />
          <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
        </form>
    );
    if (this.state.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter you data, so we can steal your identity</h4>
        {form}
      </div>
    );
  }
}

export default ContactData;
