import { put } from 'redux-saga/effects';

import * as actionTypes from '../actions/actionTypes';

const TOKEN_KEY = 'token';
const EXPIRATION_TIME_KEY = 'expirationTime';

export function* logoutSaga(action) {
  yield localStorage.removeItem(TOKEN_KEY);
  yield localStorage.removeItem(EXPIRATION_TIME_KEY);
  yield put({
    type: actionTypes.AUTH_LOGOUT,
  });
}
