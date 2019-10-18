import * as actionTypes from './actionTypes';
import axios from 'axios';

export const postSignin = (email, password) => {
    return dispatch => {
        return axios.post('/api/signin/', {email: email, password: password})
            .then(res => dispatch({type: actionTypes.GET_AUTH, is_authenticated: true}))
            .catch(res => dispatch({type: actionTypes.GET_AUTH, is_authenticated: false}))
    }
};

export const getUser = () => {
    return dispatch => {
        return axios.get('/api/user/')
            .then(res => dispatch({type: actionTypes.GET_USER, user: res.data}))
            .catch(res => dispatch({type: actionTypes.GET_AUTH, is_authenticated: false}))
    }
};