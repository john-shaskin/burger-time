import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Name'
        },
        value: ''
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street address'
        },
        value: ''
      },
      postal: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Postal code'
        },
        value: ''
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: ''
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Email address'
        },
        value: ''
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'rowboat', displayValue: 'Fastest'},
            { value: 'sloth', displayValue: 'Sloth'},
            { value: 'zeus', displayValue: 'Zeus Himself'},
          ]
        },
        value: ''
      },
    },
    loading: false,
  }

  orderHandler = (event) => {
    event.preventDefault();

    this.setState({ loading: true });
    const formData = {};
    for (let elementId in this.state.orderForm) {
      formData[elementId] = this.state.orderForm[elementId].value;
    }
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      orderData: formData,
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

  inputChangedHandler = (event, inputIdentifier) => {
    console.log(event.target.value);
    const updatedForm = {
      ...this.state.orderForm
    };
    const updatedInput = {
      ...updatedForm[inputIdentifier]
    };
    updatedInput.value = event.target.value;
    updatedForm[inputIdentifier] = updatedInput;
    this.setState({ orderForm: updatedForm });
  }

  render() {
    const formElements = [];
    for (let key in this.state.orderForm) {
      formElements.push({
        id: key,
        config: this.state.orderForm[key],
      })
    }
    let form = (
      <form onSubmit={this.orderHandler}>
        {formElements.map(formElement => (
          <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            changed={(event) => this.inputChangedHandler(event, formElement.id)} />
        ))}
        <Button btnType="Success">ORDER</Button>
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
