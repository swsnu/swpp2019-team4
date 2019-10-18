import * as actionTypes from './actionTypes';
import axios from 'axios';

export const postSignin = (id, password) => {
    return dispatch => {
        return axios.get('/api/user/')
            .then(res => dispatch({type: actionTypes.POST_SIGNIN}))
    }
};