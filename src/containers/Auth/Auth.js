import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.css';
import * as actions from  '../../store/actions';
import { updateObject, validateInput } from '../../shared/utility';

const auth = props => {
  const [authForm, setAuthForm] = useState({
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
  });
  const [formIsValid, setFormIsValid] = useState(false);
  const [isSignup, setIsSignup] = useState(true);

  const {buildingBurger, authRedirectPath, onSetAuthRedirectPath} = props;
  useEffect(() => {
    if (!buildingBurger && authRedirectPath !== '/') {
      onSetAuthRedirectPath('/');
    }
  }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);

  const inputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(authForm, {
      [controlName]: updateObject(authForm[controlName], {
        value: event.target.value,
        validationResult: validateInput(controlName, event.target.value, authForm[controlName].validation),
        touched: true,
      })
    });

    let updatedFormIsValid = true;
    for (let inputId in updatedControls) {
      updatedFormIsValid = updatedFormIsValid && updatedControls[inputId].validationResult.isValid;
    }

    setAuthForm(updatedControls);
    setFormIsValid(updatedFormIsValid);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    props.onAuth(authForm.email.value, authForm.password.value, isSignup);
  };

  const switchAuthModeHandler = (event) => {
    setIsSignup(!isSignup);
  };

  const formElements = [];
  for (let key in authForm) {
    formElements.push({
      id: key,
      config: authForm[key],
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
      changed={(event) => inputChangedHandler(event, formElement.id)} />
  ));

  if (props.loading) {
    form = <Spinner />;
  }

  let errorMessage = null;
  if (props.error) {
    errorMessage = <p>{props.error.message}</p>
  }

  let redirectToRootPath = null;
  if (props.isAuthenticated) {
    redirectToRootPath = <Redirect to={props.authRedirectPath} />;
  }

  return (
    <div className={classes.Auth}>
      {redirectToRootPath}
      {errorMessage}
      <form onSubmit={submitHandler}>
        {form}
        <Button btnType="Success" disabled={!formIsValid || props.loading}>SUBMIT</Button>
      </form>
      <Button
        btnType="Danger"
        clicked={switchAuthModeHandler}>
          { isSignup ? 'SWITCH TO SIGNIN' : 'SWITCH TO SIGNUP'}
      </Button>
    </div>
  );
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

export default connect(mapStateToProps, mapDispatchToProps)(auth);
