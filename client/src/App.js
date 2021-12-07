import React, { Component } from "react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import Routes from "./components/Routes";
import "./App.css";

// Check for token
if (localStorage.jwtToken) {
  if (localStorage.getItem("user")) {
    setAuthToken(localStorage.jwtToken);
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    store.dispatch(setCurrentUser(user));
  } else {
    // set auth token header auth
    setAuthToken(localStorage.jwtToken);
    // decode the token and get user info and exp
    const decoded = jwt_decode(localStorage.jwtToken);

    // axios.get(`/api/users/${decoded.id}`).then((res) => {
    //   store.dispatch(setCurrentUser(res.data));
    // });
    // set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));
    // check for expired token
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      // logout User
      store.dispatch(logoutUser());
      // redirect to login
      window.location.href = "/login";
    }
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Routes />
        </Router>
      </Provider>
    );
  }
}

export default App;
