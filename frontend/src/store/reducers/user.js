import * as actionTypes from '../actions/actionTypes';

const initialState = {
    user: {
        is_authenticated: null,
    },
    email_sending: null
};

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.GET_AUTH:
            return {...state, user: {is_authenticated: action.is_authenticated}};
        case actionTypes.GET_USER:
            return {...state, user: action.user};
        case actionTypes.SET_SEND_STATUS:
            return {...state, email_sending: action.email_sending};
        default:
            return {...state};
    }
};

export default reducer;