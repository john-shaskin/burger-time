import { put, delay } from 'redux-saga/effects';

import * as actions from '../actions';

const TOKEN_KEY = 'token';
const EXPIRATION_TIME_KEY = 'expirationTime';

export function* logoutSaga(action) {
  yield localStorage.removeItem(TOKEN_KEY);
  yield localStorage.removeItem(EXPIRATION_TIME_KEY);
  yield put(actions.logoutSucceeded());
}

export function* checkAuthTimeoutSaga(action) {
  yield delay(action.expirationTime);
  yield put(actions.logout());
}
