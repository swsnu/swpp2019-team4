import * as actionTypes from '../actions/actionTypes';

const initialState = {
  user: {
    is_authenticated: null,
  },
  friend: [],
  friend_send: [],
  friend_receive: [],
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
      return {
        ...state,
        friend: action.user.friend,
        friend_send: action.user.friend_send,
        friend_receive: action.user.friend_receive,
      };

    case actionTypes.GET_USER_SEARCH:
      return { ...state, search: action.search };

    case actionTypes.SEND_FRIEND:
      const stateFriendSend = state.friend_send;
      stateFriendSend.push(action.user);
      return { ...state, friend_send: stateFriendSend };

    case actionTypes.RECEIVE_FRIEND:
      const userData = state.friend_receive.find((user) => user.id === action.user.id);
      const stateFriendReceive = state.friend_receive.filter((user) => user.id !== action.user.id);
      const stateFriend = state.friend;
      stateFriend.push(userData);
      return { ...state, friend_receive: stateFriendReceive, friend: stateFriend };

    case actionTypes.DELETE_FRIEND:
      const stateFriendDelete = state.friend.filter((user) => user.id !== action.user_id);
      return { ...state, friend: stateFriendDelete };
    default:
      return { ...state };
  }
};

export default reducer;
