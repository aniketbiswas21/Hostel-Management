import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const initialState = {};

const middleware = [thunk];

const composeEnhancer =
  (window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__()) ||
  compose;

const store =
  process.env.NODE_ENV === "development"
    ? createStore(
        rootReducer,
        initialState,
        composeEnhancer(applyMiddleware(...middleware))
      )
    : createStore(
        rootReducer,
        initialState,
        compose(applyMiddleware(...middleware))
      );
export default store;
