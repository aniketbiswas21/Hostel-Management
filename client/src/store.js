import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const initialState = {};

const middleware = [thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store =
  process.env.NODE_ENV === "development"
    ? createStore(
        rootReducer,
        initialState,
        composeEnhancers(applyMiddleware(...middleware))
      )
    : createStore(
        rootReducer,
        initialState,
        compose(applyMiddleware(...middleware))
      );
export default store;
