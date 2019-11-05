import * as actionTypes from '../actions/actionTypes';

const initialState = {
  user: {
    is_authenticated: null,
  },
  friend: [],
  friend_send: [],
  friend_receive: [],
  search: {
    exist: false,
    status: '',
  },
  email_sending: null,
};

const reducer = (state = initialState, action) => {
  const stateFriend = state.friend;
  const stateFriendSend = state.friend_send;
  const stateFriendReceive = state.friend_receive;
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
      if (action.exist) {
        if (action.status === 'FRIEND') {
          stateFriend.push(action.user);
          return { ...state, search: {exist: action.exist, status: action.status}, friend: stateFriend,
            friend_receive: state.friend_receive.filter((user) => user.id !== action.user.id)};
        } else{
          stateFriendSend.push(action.user);
          return { ...state, search: {exist: action.exist, status: action.status}, friend_send :stateFriendSend};
        }
      }
      return {...state, search: {exist: action.exist, status: action.status}};

    case actionTypes.RECEIVE_FRIEND:
      stateFriend.push(state.friend_receive.find((user) => user.id === action.user.id));
      return { ...state, 
        friend_receive: state.friend_receive.filter((user) => user.id !== action.user.id),
        friend: stateFriend };

    case actionTypes.DELETE_FRIEND:
      return { ...state, friend: state.friend.filter((user) => user.id !== action.user_id)};
    default:
      return { ...state };
  }
};

export default reducer;
