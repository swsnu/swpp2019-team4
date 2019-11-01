import * as actionTypes from './actionTypes';
import axios from 'axios';

export const postSignup = (email, password, username, department, grade) => {
    return dispatch => {
        return axios.post('/api/signup/', {email: email, password: password, username: username, department: department, grade: grade})
            .then(res => alert('입력한 이메일로 확인 메일을 발송했습니다. 이메일 확인 절차를 마치면 계정이 생성됩니다.'))
            .catch(res => alert('메일을 발송하지 못했습니다. 이메일을 다시 한 번 확인해 주시기 바랍니다.'));
    }
}

export const postSignin = (email, password) => {
    return dispatch => {
        return axios.post('/api/signin/', {email: email, password: password})
            .then(res => dispatch({type: actionTypes.GET_AUTH, is_authenticated: true}))
            .catch(res => {
                dispatch({type: actionTypes.GET_AUTH, is_authenticated: false});
                alert('이메일 또는 비밀번호가 잘못되었습니다.');
            });
    }
};

export const getUser = () => {
    return dispatch => {
        return axios.get('/api/user/')
            .then(res => dispatch({type: actionTypes.GET_USER, user: res.data}))
            .catch(res => dispatch({type: actionTypes.GET_AUTH, is_authenticated: false}))
    }
};

export const getSignout = () => {
    return dispatch => {
        return axios.get('/api/signout/')
            .then(res => dispatch({type: actionTypes.GET_AUTH, is_authenticated: false}))
            .catch(() => {});
    }
};

export const getVerify = (uid, token) => {
    return dispatch => {
        return axios.get('/api/verify/'+uid+'/'+token+'/')
            .then(res => alert('이메일 확인이 완료되었습니다.'))
            .catch(res => alert('부적절한 요청입니다.'));
    }
}