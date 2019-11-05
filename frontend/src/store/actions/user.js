import axios from 'axios';
import * as actionTypes from './actionTypes';

export const setSendStatus = (status) => (dispatch) => {
  dispatch({ type: actionTypes.SET_SEND_STATUS, email_sending: status });
};

export const postSignup = (email, password, username, department, grade) => (dispatch) => axios.post('/api/signup/', {
  email, password, username, department, grade,
})
  .then(() => dispatch(setSendStatus(2)))
  .catch(() => dispatch(setSendStatus(3)));

export const postSignin = (email, password) => (dispatch) => axios.post('/api/signin/', { email, password })
  .then(() => dispatch({ type: actionTypes.GET_AUTH, is_authenticated: true }))
  .catch(() => {
    dispatch({ type: actionTypes.GET_AUTH, is_authenticated: false });
    alert('이메일 또는 비밀번호가 잘못되었습니다.');
  });

export const getUser = () => (dispatch) => axios.get('/api/user/')
  .then((res) => dispatch({ type: actionTypes.GET_USER, user: res.data }))
  .catch(() => dispatch({ type: actionTypes.GET_AUTH, is_authenticated: false }));

export const getSignout = () => (dispatch) => axios.get('/api/signout/')
  .then(() => dispatch({ type: actionTypes.GET_AUTH, is_authenticated: false }))
  .catch(() => {});

export const getVerify = (uid, token) => () => axios.get(`/api/verify/${uid}/${token}/`)
  .then(() => alert('이메일 확인이 완료되었습니다.'))
  .catch(() => alert('부적절한 요청입니다.'));
