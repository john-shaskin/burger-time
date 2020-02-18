import { put } from 'redux-saga/effects';

import axios from '../../axios-orders';
import * as actions from '../actions';

export function* orderBurgerSaga(action) {
  yield put(actions.orderBurgerSubmitted());
  try {
    const response = yield axios.post(`/orders.json?auth=${action.authToken}`, action.orderData);
    if (response && response.status === 200) {
      yield put(actions.orderBurgerSucceeded(response.data.name, action.orderData));
    }
    else {
      yield put(actions.orderBurgerFailed());
    }
  }

  catch(err) {
      yield put(actions.orderBurgerFailed(err));
  }
}

export function* fetchOrdersSaga(action) {
  put(actions.fetchOrdersStart());

  try {
    const queryParams = `auth=${action.authToken}&orderBy="userId"&equalTo="${action.userId}"`;
    const res = yield axios.get(`/orders.json?${queryParams}`);
    if (res && res.status === 200) {
      const fetchedOrders = [];
      for (let key in res.data) {
        fetchedOrders.push({
          ...res.data[key],
          id: key,
        });
      }
      yield put(actions.fetchOrdersSucceeded(fetchedOrders));
    }
    else {
      yield put(actions.fetchIngredientsFailed());
    }
  }
  catch(err) {
    yield put(actions.fetchOrdersFailed(err));
  }
}
