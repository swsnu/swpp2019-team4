import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';

export {
  postSignup,
  postSignin,
  getUser,
  putUser,
  getSignout,
  getVerify,
  getFriend,
  deleteFriend,
  rejectFriend,
  cancelFriend,
  postUserSearch,
  receiveFriend,
  getTimetables,
  getCourses,
  postCourse,
  getTimetable,
  postTimetable,
  postMainTimetable,
} from './user';
