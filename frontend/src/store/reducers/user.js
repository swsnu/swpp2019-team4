import * as actionTypes from '../actions/actionTypes';

const initialState = {
  user: {
    is_authenticated: null,
  },
  timetable: [],
  timetables: [],
  courses: [],
  friend: [],
  friend_send: [],
  friend_receive: [],
  timetable_data: [],
  search: {
    exist: false,
    status: '',
    username: '',
  },
};

const reducer = (state = initialState, action) => {
  const stateFriend = state.friend;
  const stateFriendSend = state.friend_send;
  let stateSearch;
  switch (action.type) {
    case actionTypes.GET_AUTH:
      return { ...state, user: { is_authenticated: action.is_authenticated } };
    case actionTypes.GET_USER: {
      const newUser = action.user;
      newUser.is_authenticated = true;
      return { ...state, user: newUser };
    }
    case actionTypes.GET_TIMETABLES:
      return { ...state, timetables: action.timetables };
    case actionTypes.GET_TIMETABLE:
      return { ...state, timetable: action.timetable };
    case actionTypes.POST_TIMETABLE:
      return { ...state, timetables: state.timetables.concat(action.timetable) };
    case actionTypes.POST_COURSE:
      return { ...state, timetable: action.timetable };
    case actionTypes.GET_COURSES:
      return { ...state, courses: action.courses };
    case actionTypes.GET_FRIEND:
      return {
        ...state,
        friend: action.user.friend,
        friend_send: action.user.friend_send,
        friend_receive: action.user.friend_receive,
      };

    case actionTypes.GET_USER_SEARCH:
      if (action.exist) {
        stateSearch = { exist: action.exist, status: action.status, username: action.user.username };
        if (action.status === 'FRIEND') {
          stateFriend.push(action.user);
          return {
            ...state,
            search: stateSearch,
            friend: stateFriend,
            friend_receive: state.friend_receive.filter((user) => user.id !== action.user.id),
          };
        }
        stateFriendSend.push(action.user);
        return { ...state, search: stateSearch, friend_send: stateFriendSend };
      }
      stateSearch = { exist: action.exist, status: action.status, username: '' };
      return { ...state, search: stateSearch };

    case actionTypes.RECEIVE_FRIEND:
      stateFriend.push(state.friend_receive.find((user) => user.id === action.user.id));
      return {
        ...state,
        friend_receive: state.friend_receive.filter((user) => user.id !== action.user.id),
        friend: stateFriend,
      };

    case actionTypes.DELETE_FRIEND:
      return { ...state, friend: state.friend.filter((user) => user.id !== action.user_id) };

    case actionTypes.REJECT_FRIEND:
      return { ...state, friend_receive: state.friend_receive.filter((user) => user.id !== action.user_id) };

    case actionTypes.CANCEL_FRIEND:
      return { ...state, friend_send: state.friend_send.filter((user) => user.id !== action.user_id) };

    case actionTypes.GET_TIMETABLE_DATA:
      return { ...state, timetable_data: action.timetable_list };

    case actionTypes.POST_MAIN_TIMETABLE:{
      const newuser=state.user;
      newuser.timetable_main=action.timetable_main
      return {...state, user: newuser }
    }
    default:
      return { ...state };
  }
};

export default reducer;
