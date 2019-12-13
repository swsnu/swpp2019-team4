import axios from 'axios';
import * as actionTypes from './actionTypes';

export const postSignup = (email, password, username, department, grade) => () => axios.post('/api/signup/', {
  email, password, username, department, grade,
});

export const postSignin = (email, password) => (dispatch) => axios.post('/api/signin/', { email, password })
  .then(() => dispatch({ type: actionTypes.GET_AUTH, is_authenticated: true }))
  .catch(() => dispatch({ type: actionTypes.GET_AUTH, is_authenticated: false }));

export const getUser = () => (dispatch) => axios.get('/api/user/')
  .then((res) => dispatch({ type: actionTypes.GET_USER, user: res.data }))
  .catch(() => dispatch({ type: actionTypes.GET_AUTH, is_authenticated: false }));

export const putUser = (params) => (dispatch) => axios.put('/api/user/', params)
  .then((res) => dispatch({ type: actionTypes.GET_USER, user: res.data }));

export const getSignout = () => (dispatch) => axios.get('/api/signout/')
  .then(() => dispatch({ type: actionTypes.GET_AUTH, is_authenticated: false }))
  .catch(() => {});

export const getVerify = (uid, token) => () => axios.get(`/api/verify/${uid}/${token}/`);

export const getFriend = () => (dispatch) => axios.get('/api/user/friend/')
  .then((res) => dispatch({ type: actionTypes.GET_FRIEND, user: res.data }))
  .catch(() => {});

export const getTimetable = (timetableId) => (dispatch) => axios.get(`/api/timetable/${timetableId}/`)
  .then((res) => dispatch({ type: actionTypes.GET_TIMETABLE, timetable: res.data }))
  .catch(() => {});

export const editTimetable = (timetableId, title) => (dispatch) => axios.put(`/api/timetable/${timetableId}/`, {
  title,
})
  .then((res) => dispatch({ type: actionTypes.EDIT_TIMETABLE, timetable: res.data }))
  .catch(() => {});

export const getTimetableFriend = (timetableId) => (dispatch) => axios.get(`/api/timetable/${timetableId}/`)
  .then((res) => dispatch({ type: actionTypes.GET_TIMETABLE_FRIEND, timetable: res.data }))
  .catch(() => {});

export const getCourses = (start, end, searchValues) => (dispatch) => axios.get(
  `/api/course/?start=${start}&end=${end}&title=${searchValues.title}`
  + `&classification=${searchValues.classification}&department=${searchValues.department}`
  + `&degree_program=${searchValues.degree_program}&academic_year=${searchValues.academic_year}`
  + `&course_number=${searchValues.course_number}&lecture_number=${searchValues.lecture_number}`
  + `&professor=${searchValues.professor}&language=${searchValues.language}`
  + `&min_credit=${searchValues.min_credit}&max_credit=${searchValues.max_credit}`
  + `&min_score=${searchValues.min_score}&max_score=${searchValues.max_score}`,
)
  .then((res) => dispatch({ type: actionTypes.GET_COURSES, courses: res.data }))
  .catch(() => {});

export const setCourses = (start, end, searchValues) => (dispatch) => axios.get(
  `/api/course/?start=${start}&end=${end}&title=${searchValues.title}`
  + `&classification=${searchValues.classification}&department=${searchValues.department}`
  + `&degree_program=${searchValues.degree_program}&academic_year=${searchValues.academic_year}`
  + `&course_number=${searchValues.course_number}&lecture_number=${searchValues.lecture_number}`
  + `&professor=${searchValues.professor}&language=${searchValues.language}`
  + `&min_credit=${searchValues.min_credit}&max_credit=${searchValues.max_credit}`
  + `&min_score=${searchValues.min_score}&max_score=${searchValues.max_score}`,
)
  .then((res) => dispatch({ type: actionTypes.SET_COURSES, course_list: res.data }))
  .catch(() => {});

export const postCourse = (timetableId, courseId) => (dispatch) => axios.post(
  `/api/timetable/${timetableId}/course/`, { course_id: courseId },
)
  .then((res) => dispatch({ type: actionTypes.POST_COURSE, timetable: res.data }))
  .catch(() => {});

export const postCourseTemp = (tempCourse) => (dispatch) => dispatch(
  { type: actionTypes.POST_COURSE_TEMP, course: tempCourse },
);
export const deleteCourseTemp = (course) => (dispatch) => dispatch(
  { type: actionTypes.DELETE_COURSE_TEMP, course },
);

export const editCourse = (courseId, changedValues) => (dispatch) => axios.put(
  `/api/customCourse/${courseId}/`, changedValues,
)
  .then((res) => dispatch({ type: actionTypes.EDIT_TIMETABLE, timetable: res.data }))
  .catch(() => {});

export const deleteCourse = (courseId) => (dispatch) => axios.delete(
  `/api/customCourse/${courseId}/`,
)
  .then((res) => dispatch({ type: actionTypes.EDIT_TIMETABLE, timetable: res.data }))
  .catch(() => {});

export const deleteTimetable = (timetableId) => (dispatch) => axios.delete(`/api/timetable/${timetableId}/`)
  .then(() => dispatch({ type: actionTypes.DELETE_TIMETABLE, deletedTimetable: timetableId }))
  .catch(() => {});

export const postCustomCourse = (timetableId, course) => (dispatch) => axios.post(
  `/api/timetable/${timetableId}/customCourse/`, course,
)
  .then((res) => dispatch({ type: actionTypes.POST_CUSTOM_COURSE, timetable: res.data }))
  .catch(() => {});

export const postTimetable = (title, semester) => (dispatch) => axios.post('/api/timetable/', { title, semester })
  .then((res) => dispatch({ type: actionTypes.POST_TIMETABLE, timetable: res.data }))
  .catch(() => {});

export const postUserSearch = (email) => (dispatch) => axios.post('/api/user/friend/search/', { email })
  .then((res) => dispatch({
    type: actionTypes.GET_USER_SEARCH, user: res.data.user, exist: true, status: res.data.status,
  }))
  .catch((res) => {
    dispatch({ type: actionTypes.GET_USER_SEARCH, exist: false, status: res.response.data });
  });

export const deleteFriend = (id) => (dispatch) => axios.delete(`/api/user/friend/${id}/`)
  .then(() => dispatch({ type: actionTypes.DELETE_FRIEND, user_id: id }))
  .catch(() => {});

export const receiveFriend = (id) => (dispatch) => axios.post(`/api/user/friend/${id}/`)
  .then((res) => dispatch({ type: actionTypes.RECEIVE_FRIEND, user: res.data }))
  .catch(() => {});

export const rejectFriend = (id) => (dispatch) => axios.delete(`/api/user/friend/${id}/`)
  .then(() => dispatch({ type: actionTypes.REJECT_FRIEND, user_id: id }))
  .catch(() => {});

export const cancelFriend = (id) => (dispatch) => axios.delete(`/api/user/friend/${id}/`)
  .then(() => dispatch({ type: actionTypes.CANCEL_FRIEND, user_id: id }))
  .catch(() => {});

export const getTimetables = () => (dispatch) => axios.get('/api/timetable/')
  .then((res) => dispatch({ type: actionTypes.GET_TIMETABLES, timetables: res.data }))
  .catch(() => {});

export const postMainTimetable = (id) => (dispatch) => axios.post(`/api/timetable/main/${id}`)
  .then((res) => dispatch({ type: actionTypes.POST_MAIN_TIMETABLE, main_timetable: res.data.id }))
  .catch(() => {});

export const getRecommend = () => (dispatch) => axios.get('/api/recommend/recommend/')
  .then((res) => dispatch({ type: actionTypes.GET_RECOMMEND, timetables: res.data }))
  .catch(() => {});

export const postRecommend = () => (dispatch) => axios.post('/api/recommend/recommend/')
  .then((res) => dispatch({ type: actionTypes.GET_RECOMMEND, timetables: res.data }))
  .catch(() => {});

export const deleteRecommend = () => (dispatch) => axios.delete('/api/recommend/recommend/')
  .then(() => dispatch({ type: actionTypes.GET_RECOMMEND, timetables: [] }))
  .catch(() => {});

export const getLastPage = () => (dispatch) => axios.get('/api/recommend/lastpage/')
  .then((res) => dispatch({ type: actionTypes.GET_LAST_PAGE, lastPage: res.data }))
  .catch(() => {});

export const putLastPage = (lastPage) => (dispatch) => axios.put('/api/recommend/lastpage/',
  { last_page: lastPage })
  .then(() => dispatch({ type: actionTypes.GET_LAST_PAGE, lastPage }))
  .catch(() => {});

export const editConstraints = (consts) => (dispatch) => dispatch(
  { type: actionTypes.EDIT_CONSTRAINTS, constraints: consts },
);

export const getConstraints = () => (dispatch) => axios.get('/api/recommend/constraints/')
  .then((res) => dispatch({ type: actionTypes.EDIT_CONSTRAINTS, constraints: res.data }))
  .catch(() => {});

export const putConstraints = (consts) => (dispatch) => axios.put('/api/recommend/constraints/', consts)
  .then(() => dispatch({ type: actionTypes.EDIT_CONSTRAINTS, constraints: consts }))
  .catch(() => {});

export const getTimePref = () => (dispatch) => axios.get('/api/recommend/timepref/')
  .then((res) => dispatch({ type: actionTypes.EDIT_TIME_PREF, time_pref_table: res.data }))
  .catch(() => {});

export const putTimePref = (table) => (dispatch) => axios.put('/api/recommend/timepref/', { table })
  .then(() => dispatch({ type: actionTypes.EDIT_TIME_PREF, time_pref_table: table }))
  .catch(() => {});

export const getRatedCourse = (start, end, searchValues) => (dispatch) => axios.get(
  `/api/recommend/coursepref/rated/?start=${start}&end=${end}&title=${searchValues.title}`
  + `&classification=${searchValues.classification}&department=${searchValues.department}`
  + `&degree_program=${searchValues.degree_program}&academic_year=${searchValues.academic_year}`
  + `&course_number=${searchValues.course_number}&lecture_number=${searchValues.lecture_number}`
  + `&professor=${searchValues.professor}&language=${searchValues.language}`
  + `&min_credit=${searchValues.min_credit}&max_credit=${searchValues.max_credit}`
  + `&min_score=${searchValues.min_score}&max_score=${searchValues.max_score}`,
)
  .then((res) => dispatch({ type: actionTypes.GET_RATED_COURSE, course_list: res.data }))
  .catch(() => {});

export const getUnratedCourse = (start, end, searchValues) => (dispatch) => axios.get(
  `/api/recommend/coursepref/unrated/?start=${start}&end=${end}&title=${searchValues.title}`
  + `&classification=${searchValues.classification}&department=${searchValues.department}`
  + `&degree_program=${searchValues.degree_program}&academic_year=${searchValues.academic_year}`
  + `&course_number=${searchValues.course_number}&lecture_number=${searchValues.lecture_number}`
  + `&professor=${searchValues.professor}&language=${searchValues.language}`
  + `&min_credit=${searchValues.min_credit}&max_credit=${searchValues.max_credit}`,
)
  .then((res) => dispatch({ type: actionTypes.GET_UNRATED_COURSE, course_list: res.data }))
  .catch(() => {});

export const setRatedCourse = (start, end, searchValues) => (dispatch) => axios.get(
  `/api/recommend/coursepref/rated/?start=${start}&end=${end}&title=${searchValues.title}`
  + `&classification=${searchValues.classification}&department=${searchValues.department}`
  + `&degree_program=${searchValues.degree_program}&academic_year=${searchValues.academic_year}`
  + `&course_number=${searchValues.course_number}&lecture_number=${searchValues.lecture_number}`
  + `&professor=${searchValues.professor}&language=${searchValues.language}`
  + `&min_credit=${searchValues.min_credit}&max_credit=${searchValues.max_credit}`
  + `&min_score=${searchValues.min_score}&max_score=${searchValues.max_score}`,
)
  .then((res) => dispatch({ type: actionTypes.SET_RATED_COURSE, course_list: res.data }))
  .catch(() => {});

export const setUnratedCourse = (start, end, searchValues) => (dispatch) => axios.get(
  `/api/recommend/coursepref/unrated/?start=${start}&end=${end}&title=${searchValues.title}`
  + `&classification=${searchValues.classification}&department=${searchValues.department}`
  + `&degree_program=${searchValues.degree_program}&academic_year=${searchValues.academic_year}`
  + `&course_number=${searchValues.course_number}&lecture_number=${searchValues.lecture_number}`
  + `&professor=${searchValues.professor}&language=${searchValues.language}`
  + `&min_credit=${searchValues.min_credit}&max_credit=${searchValues.max_credit}`,
)
  .then((res) => dispatch({ type: actionTypes.SET_UNRATED_COURSE, course_list: res.data }))
  .catch(() => {});

export const putCourseprefTemp = (id, score) => (dispatch) => dispatch(
  { type: actionTypes.PUT_COURSEPREF_TEMP, coursepref: { id, score } },
);

export const putCoursepref = (changedCourses) => (dispatch) => axios.put(
  '/api/recommend/coursepref/', { courses: changedCourses },
)
  .then(() => dispatch({ type: actionTypes.PUT_COURSEPREF }))
  .catch(() => {});

export const setSearchable = () => (dispatch) => dispatch({ type: actionTypes.SET_SEARCHABLE });
export const setRatedSearchable = () => (dispatch) => dispatch({ type: actionTypes.SET_RATED_SEARCHABLE });
export const setUnratedSearchable = () => (dispatch) => dispatch({ type: actionTypes.SET_UNRATED_SEARCHABLE });

export const searchBuildings = (name) => (dispatch) => axios.get(`/api/building/?name=${name}`)
  .then((res) => dispatch({ type: actionTypes.SEARCH_BUILDINGS, buildingList: res.data }))
  .catch(() => {});

export const autoComplete = () => (dispatch) => dispatch({ type: actionTypes.AUTO_COMPLETE });
