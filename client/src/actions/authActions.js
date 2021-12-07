import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";

// Register User
export const registerUser = (userData, history) => (dispatch) => {
  console.log(userData);
  axios
    .post("/api/users/register", userData)
    .then((res) => history.push("/login"))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Login - get user token
export const loginUser = (userData) => (dispatch) => {
  axios
    .post("api/users/login", userData)
    .then((res) => {
      // save to localstorage
      const { token, user } = res.data;
      // set token to localstorage
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      // set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // set current user
      dispatch(setCurrentUser(user));
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data ? err.response.data : err,
      })
    );
};

// set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// log out user
export const logoutUser = (history) => (dispatch) => {
  // remove token from localstorage
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("user");
  // reomve auth header for future requests
  setAuthToken(false);
  // set current user to {} and isAuthenticated to false
  dispatch(setCurrentUser({}));
  if (history) history.push("/");
  else window.location.href = "/";
};

// Get current User data
export const getCurrentUser = () => (dispatch) => {
  axios
    .post("api/users/current")
    .then((res) => {
      dispatch({
        type: SET_CURRENT_USER,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};
