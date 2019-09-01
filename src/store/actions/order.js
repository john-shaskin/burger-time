import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

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
  return dispatch => {
    dispatch(orderBurgerSubmitted());
    axios.post(`/orders.json?auth=${authToken}`, orderData)
      .then(response => {
        console.log(response.data);
        dispatch(orderBurgerSucceeded(response.data.name, orderData));
      })
      .catch(err => {
        dispatch(orderBurgerFailed(err));
      });
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

export const fetchOrders = (authToken) => {
  return dispatch => {
    dispatch(fetchOrdersStart());
    axios.get(`/orders.json?auth=${authToken}`)
      .then(res => {
        const fetchedOrders = [];
        for (let key in res.data) {
          fetchedOrders.push({
            ...res.data[key],
            id: key,
          });
        }
        dispatch(fetchOrdersSucceeded(fetchedOrders));
      })
      .catch(err => {
        dispatch(fetchOrdersFailed(err));
      });
  };
}
