import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import axios from '../../axios-orders';
import Order from '../../components/Order/Order';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions';
import Spinner from '../../components/UI/Spinner/Spinner';

const orders = props => {

  const {onFetchOrders, authToken, userId} = props;
  useEffect(() => {
    onFetchOrders(authToken, userId);
  }, [onFetchOrders, authToken, userId]);

  let orders = <Spinner />;
  if (!props.loading) {
    orders = props.orders.map(order => (
      <Order
        key={order.id}
        ingredients={order.ingredients}
        price={order.price} />
    ));
  }
  return (
    <div>
      {orders}
    </div>
  );
}

const mapStateToProps = state => {
  return {
    orders: state.order.orders,
    loading: state.order.loading,
    authToken: state.auth.token,
    userId: state.auth.userId,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: (authToken, userId) => dispatch(actions.fetchOrders(authToken, userId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(orders, axios));
