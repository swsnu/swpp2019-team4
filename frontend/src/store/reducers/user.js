import * as actionTypes from '../actions/actionTypes';

const initialState = {
    logged_in: false,
};

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.POST_SIGNIN:
            return {...state, logged_in: action.logged_in};
        default:
            return {...state};
    }
};

export default reducer;