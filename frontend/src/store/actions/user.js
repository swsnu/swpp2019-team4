import axios from 'axios';
import * as actionTypes from './actionTypes';

export const setSendStatus = (status) => (dispatch) => {
  dispatch({ type: actionTypes.SET_SEND_STATUS, email_sending: status });
};

export const postSignup = (email, password, username, department, grade) => (dispatch) => axios.post('/api/signup/', {
  email, password, username, department, grade,
})
  .then(() => {
    alert('입력한 이메일로 확인 메일을 발송했습니다. 이메일 확인 절차를 마치면 계정이 생성됩니다.');
    dispatch(setSendStatus(false));
  })
  .catch(() => {
    alert('메일을 발송하지 못했습니다. 이메일을 다시 한 번 확인해 주시기 바랍니다.');
    dispatch(setSendStatus(false));
  });

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
