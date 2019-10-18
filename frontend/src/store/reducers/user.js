import * as actionTypes from '../actions/actionTypes';

const initialState = {
    users: []
};

const reducer = (state = initialState, action) => {
    switch(action.types){
        default:
            return {...state};
    }
};

export default reducer;