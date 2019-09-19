import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  stateChecked: false,
  authRedirectPath: '/',
}

const stateChecked = (state, action) => {
  return updateObject(state, { authStateChecked: true });
}

const authStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
}

const authSucceeded = (state, action) => {
  return updateObject(state, { error: null, loading: false, stateInitialized: true, token: action.idToken, userId: action.userId });
}

const authFailed = (state, action) => {
  return updateObject(state, { error: action.error, loading: false, stateInitialized: true, token: null, userId: null });
}

const authLogout = (state, action) => {
  return updateObject(state, { token: null, userId: null, });
}

const setAuthRedirectPath = (state, action) => {
  return updateObject(state, { authRedirectPath: action.path });
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.AUTH_STATE_CHECKED: return stateChecked(state, action);
    case actionTypes.AUTH_START: return authStart(state, action);
    case actionTypes.AUTH_SUCCEEDED: return authSucceeded(state, action);
    case actionTypes.AUTH_FAILED: return authFailed(state, action);
    case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
    case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state, action);
    default:
      return state;
  }
};

export default reducer;
