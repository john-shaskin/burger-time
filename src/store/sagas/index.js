import { takeEvery } from 'redux-saga/effects';

import * as actionTypes from '../actions/actionTypes';
import { logoutSaga, checkAuthTimeoutSaga, authUserSaga, authCheckStateSaga } from './auth';
import { initIngredientsSaga } from './burgerBuilder';
import { orderBurgerSaga, fetchOrdersSaga } from './order';

export function* watchAuth() {
  yield takeEvery(actionTypes.AUTH_LOGOUT_INIT, logoutSaga);
  yield takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga);
  yield takeEvery(actionTypes.AUTH_LOGIN_INIT, authUserSaga);
  yield takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga);
}

export function* watchBurgerBuilder() {
  yield takeEvery(actionTypes.FETCH_INGREDIENTS_INIT, initIngredientsSaga);
}

export function* watchOrder() {
  yield takeEvery(actionTypes.ORDER_BURGER_SUBMIT, orderBurgerSaga);
  yield takeEvery(actionTypes.FETCH_ORDERS_INIT, fetchOrdersSaga);
}
