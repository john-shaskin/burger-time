import React, { Component } from 'react';

import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import classes from './Auth.css';

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Email Address'
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
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password'
        },
        value: '',
        validation: {
          required: true,
          minLength: 6,
        },
        validationResult: {
          isValid: false,
          errorMessage: null,
        },
      },
    },
  };

  render() {
    const formElements = [];
    for (let key in this.state.controls) {
      formElements.push({
        id: key,
        config: this.state.controls[key],
      })
    }

    const form = formElements.map(formElement => (
      <Input
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        invalid={!formElement.config.validationResult.isValid}
        errorMessage={formElement.config.validationResult.errorMessage}
        touched={formElement.config.touched}
        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
    ));

    return (
      <div>
        <form className={classes.Auth}>
          {form}
          <Button btnType="Success" disabled={!this.state.formIsValid}>SUBMIT</Button>
        </form>
      </div>
    )
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

    if (isValid && rules.isEmail) {
      const pattern = /^(?=[A-Z0-9][A-Z0-9@._%+-]{5,253}$)[A-Z0-9._%+-]{1,64}@(?:(?=[A-Z0-9-]{1,63}\.)[A-Z0-9]+(?:-[A-Z0-9]+)*\.){1,8}[A-Z]{2,63}$/;
      isValid = pattern.test(value.toUpperCase());
      errorMessage = `${key} must be a valid email address`;
    }

    if (isValid && rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value);
      errorMessage = `${key} is a numeric value.`;
    }

    return { isValid, errorMessage };
  }

  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        validationResult: this.validateInput(controlName, event.target.value, this.state.controls[controlName].validation),
        touched: true,
      }
    };

    this.setState({ controls: updatedControls });
  }
}

export default Auth;
