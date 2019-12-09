import axios from 'axios';

import * as actionTypes from './actionTypes';

const TOKEN_KEY = 'token';
const EXPIRATION_TIME_KEY = 'expirationTime';

export const authStateChecked = () => {
  return {
    type: actionTypes.AUTH_STATE_CHECKED,
  };
};

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSucceeded = (idToken, userId) => {
  return {
    type: actionTypes.AUTH_SUCCEEDED,
    idToken,
    userId,
  };
};

export const authFailed = (error) => {
  return {
    type: actionTypes.AUTH_FAILED,
    error,
  };
};

export const logout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT_INIT,
  };
};

export const logoutSucceeded = () => {
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return {
    type: actionTypes.AUTH_CHECK_TIMEOUT,
    expirationTime,
  }
}

export const auth = (email, password, isSignup) => {
  return {
    type: actionTypes.AUTH_LOGIN_INIT,
    email,
    password,
    isSignup,
  };
};

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path,
  };
};

export const authCheckState = () => {
  return dispatch => {
    const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
    if (!apiKey) {
      return Promise.reject('There is no configured API key for Firebase');
    }

    const token = localStorage.getItem(TOKEN_KEY);
    const expirationTimeStr = localStorage.getItem(EXPIRATION_TIME_KEY);
    dispatch(authStateChecked());

    if (token && expirationTimeStr) {
      const expiry = new Date(expirationTimeStr);
      const now = new Date();

      if (expiry < now) {
        dispatch(logout());
      } else {
        axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
          idToken: token,
        }).then(response => {
          dispatch(authSucceeded(token, response.data.users[0].localId));
          dispatch(checkAuthTimeout((expiry.getTime() - new Date().getTime()) / 1000));
        }).catch(err => {
          dispatch(authFailed(err));
        });
      }
    } else {
      dispatch(logout());
    }
  }
}
