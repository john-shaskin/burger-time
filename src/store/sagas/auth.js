import { put, delay, call } from 'redux-saga/effects';
import axios from 'axios';

import * as actions from '../actions';

const TOKEN_KEY = 'token';
const EXPIRATION_TIME_KEY = 'expirationTime';

export function* logoutSaga(action) {
  // Using call is useful for making generators testable, by allowing mocking of the use of call
  yield call([localStorage, 'removeItem'], TOKEN_KEY);
  // yield localStorage.removeItem(TOKEN_KEY);
  yield localStorage.removeItem(EXPIRATION_TIME_KEY);
  yield put(actions.logoutSucceeded());
}

export function* checkAuthTimeoutSaga(action) {
  yield delay(action.expirationTime * 1000);
  yield put(actions.logout());
}

export function* authUserSaga(action) {
  yield put(actions.authStart());

  const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
  if (!apiKey) {
    return Promise.reject('There is no configured API key for Firebase');
  }

  let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
  let postData = {
    email: action.email,
    password: action.password,
    returnSecureToken: true,
  };

  if (!action.isSignup) {
    url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
  }

  try {
    const response = yield axios.post(url, postData);
    yield localStorage.setItem(TOKEN_KEY, response.data.idToken);
    yield localStorage.setItem(EXPIRATION_TIME_KEY, new Date(new Date().getTime() + response.data.expiresIn * 1000));
    yield put(actions.authSucceeded(response.data.idToken, response.data.localId));
    yield put(actions.checkAuthTimeout(response.data.expiresIn));
  }
  catch(err) {
    yield put(actions.authFailed(err.response.data.error));
  }
}

export function* authCheckStateSaga(action) {
  const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
  if (!apiKey) {
    return Promise.reject('There is no configured API key for Firebase');
  }

  const token = yield localStorage.getItem(TOKEN_KEY);
  const expirationTimeStr = yield localStorage.getItem(EXPIRATION_TIME_KEY);
  yield put(actions.authStateChecked());

  if (token && expirationTimeStr) {
    const expiry = new Date(expirationTimeStr);
    const now = new Date();

    if (expiry < now) {
      yield put(actions.logout());
    } else {

      try {
        const response = yield axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
          idToken: token,
        });
        yield put(actions.authSucceeded(token, response.data.users[0].localId));
        yield put(actions.checkAuthTimeout((expiry.getTime() - new Date().getTime()) / 1000));
      }
      catch(err) {
        yield put(actions.authFailed(err));
      }

    }
  } else {
    yield put(actions.logout());
  }
}
