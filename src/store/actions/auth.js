import * as actionTypes from './actionTypes';

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
  return {
    type: actionTypes.AUTH_CHECK_STATE,
  };
}
