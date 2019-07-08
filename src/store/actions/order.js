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

export const orderBurger = (orderData) => {
  return dispatch => {
    dispatch(orderBurgerSubmitted());
    axios.post('/orders.json', orderData)
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
