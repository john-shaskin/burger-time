import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  orders: [],
  loading: false,
};

const orderInit = (state, action) => {
  return updateObject(state, { ordered: false });
};

const orderBurgerSubmitted = (state, action) => {
  return updateObject(state, { loading: true });
};

const orderBurgerSucceeded = (state, action) => {
  const order = updateObject(action.orderData, {
    id: action.orderId,
  });

  return updateObject(state, {
    loading: false,
    ordered: true,
    orders: state.orders.concat(order),
  });
};

const orderBurgerFailed = (state, action) => {
  return updateObject(state, { loading: false });
};

const fetchOrdersStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchOrdersSucceeded = (state, action) => {
  return updateObject(state, {
    loading: false,
    orders: action.orders,
  });
};

const fetchOrdersFailed = (state, action) => {
  return updateObject(state, {
    loading: false,
  });
};

const reducer = (state=initialState, action) => {
  switch(action.type) {
    case actionTypes.ORDER_INIT: return orderInit(state, action);
    case actionTypes.ORDER_BURGER_SUBMITTED: return orderBurgerSubmitted(state, action);
    case actionTypes.ORDER_BURGER_SUCCEEDED: return orderBurgerSucceeded(state, action);
    case actionTypes.ORDER_BURGER_FAILED: return orderBurgerFailed(state, action);
    case actionTypes.FETCH_ORDERS_START: return fetchOrdersStart(state, action);
    case actionTypes.FETCH_ORDERS_SUCCEEDED: return fetchOrdersSucceeded(state, action);
    case actionTypes.FETCH_ORDERS_FAILED: return fetchOrdersFailed(state, action);
    default: return state;
  }
};

export default reducer;
