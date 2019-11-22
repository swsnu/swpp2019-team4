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
  getCourses,
  postCourse,
  getTimetable,
  getTimetables,
  getTimetableFriend,
  postTimetable,
  postMainTimetable,
  postCustomCourse,
  deleteCourse,
} from './user';
