import { put } from 'redux-saga/effects';

import axios from '../../axios-orders';
import * as actions from '../actions';

export function* initIngredientsSaga(action) {
  try {
    const response = yield axios.get('https://burger-time-b9943.firebaseio.com/ingredients.json');
    if (response && response.status === 200) {
      yield put(actions.setIngredients(response.data));
    }
    else {
      yield put(actions.fetchIngredientsFailed());
    }
  }
  catch (err) {
    yield put(actions.fetchIngredientsFailed());
  }
}
