import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions';

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Name'
        },
        value: '',
        validation: {
          required: true,
        },
        validationResult: {
          isValid: false,
          errorMessage: null,
        },
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street address'
        },
        value: '',
        validation: {
          required: true,
        },
        validationResult: {
          isValid: false,
          errorMessage: null,
        },
        touched: false,
      },
      postal: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Postal code'
        },
        value: '',
        validation: {
          required: true,
          minLength: 6,
          maxLength: 6,
        },
        validationResult: {
          isValid: false,
          errorMessage: null,
        },
        touched: false,
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: '',
        validation: {
          required: true,
        },
        validationResult: {
          isValid: false,
          errorMessage: null,
        },
        touched: false,
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Email address'
        },
        value: '',
        validation: {
          required: true,
        },
        validationResult: {
          isValid: false,
          errorMessage: null,
        },
        touched: false,
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'rowboat', displayValue: 'Rowboat'},
            { value: 'sloth', displayValue: 'Sloth'},
            { value: 'zeus', displayValue: 'Zeus Himself'},
          ]
        },
        value: 'rowboat',
        validation: {},
        validationResult: {
          isValid: true,
          errorMessage: null,
        },
        touched: false,
      },
    },
    formIsValid: false,
    loading: false,
  }

  orderHandler = (event) => {
    event.preventDefault();

    const formData = {};
    for (let elementId in this.state.orderForm) {
      formData[elementId] = this.state.orderForm[elementId].value;
    }
    const order = {
      ingredients: this.props.ings,
      price: this.props.price,
      orderData: formData,
    };

    this.props.onSubmitOrder(order);
  }

  validateInput(key, value, rules) {
    let isValid = true;
    let errorMessage = '';

    if (isValid && rules.required) {
      isValid = value.trim() !== '';
      errorMessage = `${key} is required.`;
    }

    if (isValid && rules.minLength) {
      isValid = value.trim().length >= rules.minLength;
      errorMessage = `${key} needs to be at least ${rules.minLength} characters.`
    }

    if (isValid && rules.maxLength) {
      isValid = value.trim().length <= rules.maxLength;
      errorMessage = `${key} cannot be more than ${rules.maxLength} characters.`
    }

    return { isValid, errorMessage };
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedForm = {
      ...this.state.orderForm
    };
    const updatedInput = {
      ...updatedForm[inputIdentifier]
    };
    updatedInput.value = event.target.value;
    updatedInput.validationResult = this.validateInput(inputIdentifier, updatedInput.value, updatedInput.validation);
    updatedInput.touched = true;
    updatedForm[inputIdentifier] = updatedInput;

    let formIsValid = true;
    for (let inputIdentifier in updatedForm) {
      formIsValid = formIsValid && updatedForm[inputIdentifier].validationResult.isValid;
    }
    this.setState({ orderForm: updatedForm, formIsValid });
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
            invalid={!formElement.config.validationResult.isValid}
            errorMessage={formElement.config.validationResult.errorMessage}
            touched={formElement.config.touched}
            changed={(event) => this.inputChangedHandler(event, formElement.id)} />
        ))}
        <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
      </form>
    );
    if (this.props.loading) {
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

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSubmitOrder: (orderData) => dispatch(actions.orderBurger(orderData)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
