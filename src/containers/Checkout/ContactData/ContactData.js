import React, { useState } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions';
import { updateObject, validateInput } from '../../../shared/utility';

const contactData = props => {
  const [orderForm, setOrderForm] = useState({
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
  });

  const [formIsValid, setFormIsValid] = useState(false);

  const orderHandler = (event) => {
    event.preventDefault();

    const formData = {};
    for (let elementId in orderForm) {
      formData[elementId] = orderForm[elementId].value;
    }
    const order = {
      ingredients: props.ings,
      price: props.price,
      orderData: formData,
      userId: props.userId,
    };

    props.onSubmitOrder(order, props.authToken);
  };

  const inputChangedHandler = (event, inputIdentifier) => {
    const updatedInput = updateObject(orderForm[inputIdentifier], {
      value: event.target.value,
      validationResult: validateInput(inputIdentifier, event.target.value, orderForm[inputIdentifier].validation),
      touched: true,
    });

    const updatedOrderForm = updateObject(orderForm, {
      [inputIdentifier]: updatedInput,
    });

    let updatedFormIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      updatedFormIsValid = updatedFormIsValid && updatedOrderForm[inputIdentifier].validationResult.isValid;
    }
    setOrderForm(updatedOrderForm);
    setFormIsValid(updatedFormIsValid);
  };

  const formElements = [];
  for (let key in orderForm) {
    formElements.push({
      id: key,
      config: orderForm[key],
    })
  }
  let form = (
    <form onSubmit={orderHandler}>
      {formElements.map(formElement => (
        <Input
          key={formElement.id}
          elementType={formElement.config.elementType}
          elementConfig={formElement.config.elementConfig}
          value={formElement.config.value}
          invalid={!formElement.config.validationResult.isValid}
          errorMessage={formElement.config.validationResult.errorMessage}
          touched={formElement.config.touched}
          changed={(event) => inputChangedHandler(event, formElement.id)} />
      ))}
      <Button btnType="Success" disabled={!formIsValid}>ORDER</Button>
    </form>
  );
  if (props.loading) {
    form = <Spinner />;
  }
  return (
    <div className={classes.ContactData}>
      <h4>Enter you data, so we can steal your identity</h4>
      {form}
    </div>
  );
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

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(contactData, axios));
