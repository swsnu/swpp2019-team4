import * as actionTypes from '../actions/actionTypes';

const initialState = {
  user: {
    is_authenticated: null,
  },
  friend: [],
  friend_send: [],
  friend_recieve: [],
  search: {
    is_exist: false,
    id: 0,
    email: '',
    username: '',
  },
  email_sending: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_AUTH:
      return { ...state, user: { is_authenticated: action.is_authenticated } };
    case actionTypes.GET_USER:
      return { ...state, user: { ...action.user, is_authenticated: true } };
    case actionTypes.SET_SEND_STATUS:
      return { ...state, email_sending: action.email_sending };
    case actionTypes.GET_FRIEND:
      return { ...state, friend: action.user.friend, friend_send: action.user.friend_send,
        friend_recieve: action.user.friend_recieve };
    case actionTypes.GET_USER_SEARCH:
      return { ...state, search: action.search };
    case actionTypes.SEND_FRIEND:
      return { ...state }
    case actionTypes.SEND_FRIEND_UNDO:
      return { ...state }
    case actionTypes.RECIEVE_FRIEND:
      return { ...state }
    case actionTypes.RECIEVE_FRIEND_UNDO:
      return { ...state }
    case actionTypes.DELETE_FRIEND:
      const friend = state.friend.filter((user) => {
        return user.id !== action.user_id;
      });
      return { ...state, friend: friend }
    default:
      return { ...state };
  }
};

export default reducer;
