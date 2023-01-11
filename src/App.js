import React, { useEffect, Suspense } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import Spinner from './components/UI/Spinner/Spinner';
import * as actions from './store/actions/index';

// Components for different routes
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
const Checkout = React.lazy(() => import('./containers/Checkout/Checkout'));
const Orders = React.lazy(() => import('./containers/Orders/Orders'));
const Auth = React.lazy(() => import('./containers/Auth/Auth'));
const Logout = React.lazy(() => import('./containers/Auth/Logout/Logout'));

const app = props => {
  const { onAuthCheckState } = props;
  useEffect(() => {
    onAuthCheckState();
  }, [onAuthCheckState]);

  let notFoundRedirect = null;
  if (props.isAuthStateChecked) {
    notFoundRedirect = (
      <Redirect to="/" />
    );
  }

  let routes = (
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route path="/" exact component={BurgerBuilder} />
      {notFoundRedirect}
    </Switch>
  );

  if (props.isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/checkout" component={Checkout} />
        <Route path="/orders" component={Orders} />
        <Route path="/logout" component={Logout} />
        <Route path="/auth" component={Auth} />
        <Route path="/" exact component={BurgerBuilder} />
        {notFoundRedirect}
      </Switch>
    );
  }

  return (
    <div>
      <Layout>
        <Suspense fallback={<Spinner />}>
          {routes}
        </Suspense>
      </Layout>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    isAuthStateChecked: state.auth.stateChecked,
    isAuthenticated: state.auth.token !== null,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onAuthCheckState: () => dispatch(actions.authCheckState()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(app));
