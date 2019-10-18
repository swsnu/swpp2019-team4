import * as actionTypes from './actionTypes';
import axios from 'axios';

export const postSignin = (email, password) => {
    return dispatch => {
        return axios.post('/api/signin/', {email: email, password: password})
            .then(res => dispatch({type: actionTypes.POST_SIGNIN, logged_in: true}))
            .catch(res => dispatch({type: actionTypes.POST_SIGNIN, logged_in: false}))
    }
};