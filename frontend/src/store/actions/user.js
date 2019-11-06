import axios from 'axios';
import * as actionTypes from './actionTypes';

export const postSignup = (email, password, username, department, grade) => () => axios.post('/api/signup/', {
  email, password, username, department, grade,
});

export const postSignin = (email, password) => (dispatch) => axios.post('/api/signin/', { email, password })
  .then(() => dispatch({ type: actionTypes.GET_AUTH, is_authenticated: true }))
  .catch(() => dispatch({ type: actionTypes.GET_AUTH, is_authenticated: false }));

export const getUser = () => (dispatch) => axios.get('/api/user/')
  .then((res) => dispatch({ type: actionTypes.GET_USER, user: res.data }))
  .catch(() => dispatch({ type: actionTypes.GET_AUTH, is_authenticated: false }));

export const getSignout = () => (dispatch) => axios.get('/api/signout/')
  .then(() => dispatch({ type: actionTypes.GET_AUTH, is_authenticated: false }))
  .catch(() => {});

export const getVerify = (uid, token) => () => axios.get(`/api/verify/${uid}/${token}/`);

export const getFriend = () => (dispatch) => axios.get('/api/user/friend/')
  .then((res) => dispatch({ type: actionTypes.GET_FRIEND, user: res.data }))
  .catch(() => {});

export const postUserSearch = (email) => (dispatch) => axios.post('/api/user/friend/search/', { email })
  .then((res) => dispatch({
    type: actionTypes.GET_USER_SEARCH, user: res.data.user, exist: true, status: res.data.status,
  }))
  .catch((res) => {
    dispatch({ type: actionTypes.GET_USER_SEARCH, exist: false, status: res.response.data });
  });

export const deleteFriend = (id) => (dispatch) => axios.delete(`/api/user/friend/${id}/`)
  .then(() => dispatch({ type: actionTypes.DELETE_FRIEND, user_id: id }))
  .catch(() => {});

export const receiveFriend = (id) => (dispatch) => axios.post(`/api/user/friend/${id}/`)
  .then((res) => dispatch({ type: actionTypes.RECEIVE_FRIEND, user: res.data }))
  .catch(() => {});

export const rejectFriend = (id) => (dispatch) => axios.delete(`/api/user/friend/${id}/`)
  .then(() => dispatch({ type: actionTypes.REJECT_FRIEND, user_id: id }))
  .catch(() => {});

export const cancelFriend = (id) => (dispatch) => axios.delete(`/api/user/friend/${id}/`)
  .then(() => dispatch({ type: actionTypes.CANCEL_FRIEND, user_id: id }))
  .catch(() => {});
