import * as actionTypes from '../actions/actionTypes';
import { resetCourse } from '../actions/user';

const initialState = {
  user: {
    is_authenticated: null,
  },
  timetable: { course: [] },
  timetable_friend: { course: [] },
  timetables: [],
  courses: [],
  rated_course: [],
  unrated_course: [],
  changed_courses: [],
  friend: [],
  friend_send: [],
  friend_receive: [],
  search: {
    exist: false,
    status: '',
    username: '',
  },
  constraints: {
    days_per_week: 5,
    credit_min: 15,
    credit_max: 18,
    major_min: 1,
    major_max: 18,
  },
  time_pref_table: [
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3]
  ],
  recommended_timetables: []
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
    case actionTypes.GET_TIMETABLE:
      return { ...state, timetable: action.timetable };
    case actionTypes.GET_TIMETABLE_FRIEND:
      return { ...state, timetable_friend: action.timetable };
    case actionTypes.POST_TIMETABLE:
      return { ...state, timetables: state.timetables.concat(action.timetable) };
    case actionTypes.POST_COURSE_TEMP:
      state.timetable.course = state.timetable.course.concat(action.course);
      return { ...state };
    case actionTypes.DELETE_COURSE_TEMP:
      state.timetable.course = state.timetable.course.filter((item) => !(item.id === action.course.id && item.temp === true));
      return { ...state };
    case actionTypes.POST_COURSE:
      return { ...state, timetable: action.timetable };
    case actionTypes.POST_CUSTOM_COURSE:
      return { ...state, timetable: action.timetable };
    case actionTypes.EDIT_TIMETABLE:
      return {
        ...state,
        timetables: state.timetables.map((timetable) => (timetable.id
          === action.timetable.id ? action.timetable : timetable)),
        timetable: action.timetable,
      };
    case actionTypes.DELETE_TIMETABLE:
      return { ...state, timetables: state.timetables.filter((timetable) => timetable.id !== action.deletedTimetable) };
    case actionTypes.GET_COURSES: {
      const newcourses = state.courses.concat(action.courses);
      return { ...state, courses: newcourses };
    }
    case actionTypes.SET_COURSES:
      return {
        ...state, courses: action.course_list,
      };
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
      stateFriend.push(action.user);
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

    case actionTypes.GET_TIMETABLES:
      return { ...state, timetables: action.timetables };

    case actionTypes.POST_MAIN_TIMETABLE: {
      const newuser = state.user;
      newuser.timetable_main = action.timetable_main;
      return { ...state, user: newuser };
    }
    case actionTypes.GET_RECOMMEND: {
      return { ...state, recommended_timetables: action.timetables }
    }
    case actionTypes.EDIT_CONSTRAINTS: {
      return { ...state, constraints: action.constraints }
    }
    case actionTypes.EDIT_TIME_PREF: {
      return { ...state, time_pref_table: action.time_pref_table }
    }
    case actionTypes.GET_RATED_COURSE: {
      const newlist = state.rated_course.concat(action.course_list);
      return { ...state, rated_course: newlist };
    }
    case actionTypes.GET_UNRATED_COURSE: {
      const newlist = state.unrated_course.concat(action.course_list);
      return { ...state, unrated_course: newlist };
    }
    case actionTypes.SET_RATED_COURSE:
      return { ...state, rated_course: action.course_list };
    case actionTypes.SET_UNRATED_COURSE:
      return { ...state, unrated_course: action.course_list };
    case actionTypes.PUT_COURSEPREF_TEMP:
      state.rated_course = state.rated_course.map(({ id, score, ...item }) => (id === action.coursepref.id ? { id, score: action.coursepref.score, ...item } : { id, score, ...item }));
      state.unrated_course = state.unrated_course.map(({ id, score, ...item }) => (id === action.coursepref.id ? { id, score: action.coursepref.score, ...item } : { id, score, ...item }));
      const targetCourse = state.changed_courses.filter((course) => course.id === action.coursepref.id);
      if (targetCourse.length > 0) {
        state.changed_courses = state.changed_courses.map(({ id, score }) => (id === action.coursepref.id ? { id, score: action.coursepref.score } : { id, score }));
      } else {
        state.changed_courses.push(action.coursepref);
      }
      return { ...state };
    case actionTypes.PUT_COURSEPREF:
      return { ...state, changed_courses: [] };
    default:
      return { ...state };
  }
};

export default reducer;
