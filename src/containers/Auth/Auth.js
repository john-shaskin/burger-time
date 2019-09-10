import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.css';
import * as actions from  '../../store/actions';
import { updateObject } from '../../shared/utility';

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
    formIsValid: false,
    isSignup: true,
  };

  componentDidMount() {
    if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
      this.props.onSetAuthRedirectPath('/');
    }
  }

  render() {
    const formElements = [];
    for (let key in this.state.controls) {
      formElements.push({
        id: key,
        config: this.state.controls[key],
      })
    }

    let form = formElements.map(formElement => (
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

    if (this.props.loading) {
      form = <Spinner />;
    }

    let errorMessage = null;
    if (this.props.error) {
      errorMessage = <p>{this.props.error.message}</p>
    }

    let redirectToRootPath = null;
    if (this.props.isAuthenticated) {
      redirectToRootPath = <Redirect to={this.props.authRedirectPath} />;
    }

    return (
      <div className={classes.Auth}>
        {redirectToRootPath}
        {errorMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType="Success" disabled={!this.state.formIsValid || this.props.loading}>SUBMIT</Button>
        </form>
        <Button
          btnType="Danger"
          clicked={this.switchAuthModeHandler}>
            { this.state.isSignup ? 'SWITCH TO SIGNIN' : 'SWITCH TO SIGNUP'}
        </Button>
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
    const updatedControls = updateObject(this.state.controls, {
      [controlName]: updateObject(this.state.controls[controlName], {
        value: event.target.value,
        validationResult: this.validateInput(controlName, event.target.value, this.state.controls[controlName].validation),
        touched: true,
      })
    });

    let formIsValid = true;
    for (let inputId in updatedControls) {
      formIsValid = formIsValid && updatedControls[inputId].validationResult.isValid;
    }

    this.setState({ controls: updatedControls, formIsValid });
  }

  submitHandler = (event) => {
    event.preventDefault();

    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
  }

  switchAuthModeHandler = (event) => {
    this.setState(prevState => {
      return { isSignup: !prevState.isSignup };
    })
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
