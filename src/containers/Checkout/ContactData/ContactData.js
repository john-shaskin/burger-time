import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions';
import { updateObject, validateInput } from '../../../shared/utility';

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
          isEmail: true,
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
      userId: this.props.userId,
    };

    this.props.onSubmitOrder(order, this.props.authToken);
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedInput = updateObject(this.state.orderForm[inputIdentifier], {
      value: event.target.value,
      validationResult: validateInput(inputIdentifier, event.target.value, this.state.orderForm[inputIdentifier].validation),
      touched: true,
    });

    const updatedOrderForm = updateObject(this.state.orderForm, {
      [inputIdentifier]: updatedInput,
    });

    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = formIsValid && updatedOrderForm[inputIdentifier].validationResult.isValid;
    }
    this.setState({ orderForm: updatedOrderForm, formIsValid });
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
    authToken: state.auth.token,
    userId: state.auth.userId,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSubmitOrder: (orderData, authToken) => dispatch(actions.orderBurger(orderData, authToken)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
