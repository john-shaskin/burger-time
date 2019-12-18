import * as actionTypes from './actionTypes';

export const orderBurgerSucceeded = (id, orderData) => {
  return {
    type: actionTypes.ORDER_BURGER_SUCCEEDED,
    orderId: id,
    orderData: orderData,
  };
};

export const orderBurgerFailed = (error) => {
  return {
    type: actionTypes.ORDER_BURGER_FAILED,
    error: error,
  }
}

export const orderBurgerSubmitted = () => {
  return {
    type: actionTypes.ORDER_BURGER_SUBMITTED
  };
}

export const orderBurger = (orderData, authToken) => {
  return {
    type: actionTypes.ORDER_BURGER_SUBMIT,
    orderData,
    authToken,
  }
};

export const orderInit = () => {
  return { type: actionTypes.ORDER_INIT };
};

export const fetchOrdersSucceeded = (orders) => {
  return {
    type: actionTypes.FETCH_ORDERS_SUCCEEDED,
    orders,
  };
};

export const fetchOrdersFailed = (error) => {
  return {
    type: actionTypes.FETCH_ORDERS_FAILED,
    error,
  };
};

export const fetchOrdersStart = () => {
  return {
    type: actionTypes.FETCH_ORDERS_START,
  };
};

export const fetchOrders = (authToken, userId) => {
  return {
    type: actionTypes.FETCH_ORDERS_INIT,
    authToken,
    userId,
  };
}
