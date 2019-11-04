import {
  createStore, combineReducers, compose, applyMiddleware,
} from 'redux';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import userReducer from './reducers/user';

export const history = createBrowserHistory();
const rootReducer = combineReducers({
  user: userReducer,
  router: connectRouter(history),
});

const logger = () => (next) => (action) => {
  // console.log('[Middleware] Dispatching', action);
  const result = next(action);
  // console.log('[Middleware] Next State', store.getState());
  return result;
};
export const middlewares = [logger, thunk, routerMiddleware(history)];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer,
  composeEnhancers(
    applyMiddleware(...middlewares),
  ));

export default store;
