import axios from 'axios';
import * as actionTypes from './actionTypes';

export const postSignup = (email, password, username, department, grade) => () => axios.post('/api/signup/', {
  email, password, username, department, grade,
}).catch(() => {});

export const postSignin = (email, password) => (dispatch) => axios.post('/api/signin/', { email, password })
  .then(() => dispatch({ type: actionTypes.GET_AUTH, is_authenticated: true }))
  .catch(() => dispatch({ type: actionTypes.GET_AUTH, is_authenticated: false }));

export const getUser = () => (dispatch) => axios.get('/api/user/')
  .then((res) => dispatch({ type: actionTypes.GET_USER, user: res.data }))
  .catch(() => dispatch({ type: actionTypes.GET_AUTH, is_authenticated: false }));

export const getSignout = () => (dispatch) => axios.get('/api/signout/')
  .then(() => dispatch({ type: actionTypes.GET_AUTH, is_authenticated: false }))
  .catch(() => {});

export const getVerify = (uid, token) => () => axios.get(`/api/verify/${uid}/${token}/`)
  .catch(() => {});
