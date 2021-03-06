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
  setCourses,
  postCourse,
  postCourseTemp,
  deleteCourseTemp,
  getTimetable,
  editTimetable,
  editCourse,
  getTimetables,
  getTimetableFriend,
  postTimetable,
  postMainTimetable,
  postCustomCourse,
  deleteCourse,
  deleteTimetable,
  getRecommend,
  postRecommend,
  deleteRecommend,
  getLastPage,
  putLastPage,
  editConstraints,
  getConstraints,
  putConstraints,
  getTimePref,
  putTimePref,
  getRatedCourse,
  getUnratedCourse,
  setRatedCourse,
  setUnratedCourse,
  putCoursepref,
  putCourseprefTemp,
  deleteCoursepref,
  deleteCourseprefTemp,
  setSearchable,
  setRatedSearchable,
  setUnratedSearchable,
  searchBuildings,
  autoComplete,
} from './user';
