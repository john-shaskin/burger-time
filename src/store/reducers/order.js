import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  orders: [],
  loading: false,
};

const reducer = (state=initialState, action) => {
  switch(action.type) {
    case actionTypes.ORDER_INIT:
      return updateObject(state, {
        ordered: false,
      });

    case actionTypes.ORDER_BURGER_SUBMITTED:
      return updateObject(state, {
        loading: true,
      });

    case actionTypes.ORDER_BURGER_SUCCEEDED:
      const order = updateObject(action.orderData, {
        id: action.orderId,
      });

      return updateObject(state, {
        loading: false,
        ordered: true,
        orders: state.orders.concat(order),
      });

    case actionTypes.ORDER_BURGER_FAILED:
      return updateObject(state, {
        loading: false,
      });

    case actionTypes.FETCH_ORDERS_START:
      return updateObject(state, {
        loading: true,
      });

    case actionTypes.FETCH_ORDERS_SUCCEEDED:
      return updateObject(state, {
        loading: false,
        orders: action.orders,
      });

    case actionTypes.FETCH_ORDERS_FAILED:
      return updateObject(state, {
        loading: false,
      });

    default:
      return state;
  }
};

export default reducer;
