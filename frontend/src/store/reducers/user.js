import * as actionTypes from '../actions/actionTypes';

const initialState = {
  user: {
    is_authenticated: null,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_AUTH:
      return { ...state, user: { is_authenticated: action.is_authenticated } };
    case actionTypes.GET_USER:
      return { ...state, user: action.user };
    default:
      return { ...state };
  }
};

export default reducer;
