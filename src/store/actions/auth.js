import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  }
};

export const authSucceeded = (authData) => {
  return {
    type: actionTypes.AUTH_SUCCEEDED,
    authData,
  };
};

export const authFailed = (error) => {
  return {
    type: actionTypes.AUTH_FAILED,
    error,
  };
};

export const auth = (email, password) => {
  return dispatch => {
    dispatch(authStart());

    const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
    if (!apiKey) {
      return Promise.reject('There is no configured API key for Firebase');
    }

    axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
    {
      email,
      password,
      returnSecureToken: true,
    })
      .then(response => {
        console.log(response);
        dispatch(authSucceeded(response.data));
      })
      .catch(err => {
        console.log(err);
        dispatch(authFailed());
      });

  };
};