import * as actionTypes from '../actions/actionTypes';

const initialState = {
  orders: [],
  loading: false,
};

const reducer = (state=initialState, action) => {
  switch(action.type) {
    case actionTypes.ORDER_INIT:
      return {
        ...state,
        ordered: false,
      }

    case actionTypes.ORDER_BURGER_SUBMITTED:
      return {
        ...state,
        loading: true,
      };

    case actionTypes.ORDER_BURGER_SUCCEEDED:
      const order = {
        ...action.orderData,
        id: action.orderId,
      };

      return {
        ...state,
        loading: false,
        ordered: true,
        orders: state.orders.concat(order),
      };

    case actionTypes.ORDER_BURGER_FAILED:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export default reducer;
