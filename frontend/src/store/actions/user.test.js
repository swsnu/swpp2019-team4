import axios from 'axios';
import * as actionCreators from './index';
import store from '../store';
import reducer from '../reducers/user';

jest.mock('../reducers/user', () => jest.fn((state, action) => action));

describe('user action test', () => {
  beforeEach(() => {});

  afterEach(() => { jest.clearAllMocks(); });

  it('should call postSignup', (done) => {
    axios.post = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 201, data: null });
    }));
    store.dispatch(actionCreators.postSignup())
      .then(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should run .catch when signup failed', (done) => {
    axios.post = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.postSignup())
      .catch(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call postSignin', (done) => {
    axios.post = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 200, data: null });
    }));
    store.dispatch(actionCreators.postSignin())
      .then(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call alert when signin failed', (done) => {
    axios.post = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.postSignin())
      .then(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call getSignout', (done) => {
    axios.get = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 200, data: null });
    }));
    store.dispatch(actionCreators.getSignout())
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call getSignout that can be failed', (done) => {
    axios.get = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.getSignout())
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call getUser', (done) => {
    axios.get = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 200, data: null });
    }));
    store.dispatch(actionCreators.getUser())
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call putUser', (done) => {
    axios.put = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 200, data: null });
    }));
    store.dispatch(actionCreators.putUser())
      .then(() => {
        expect(axios.put).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call getUser that can be failed', (done) => {
    axios.get = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.getUser())
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call getVerify', (done) => {
    axios.get = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 204, data: null });
    }));
    store.dispatch(actionCreators.getVerify())
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call getTimetables', (done) => {
    axios.get = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 204, data: null });
    }));
    store.dispatch(actionCreators.getTimetables())
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call getTimetables that can be failed', (done) => {
    axios.get = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.getTimetables())
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call getTimetable', (done) => {
    axios.get = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 204, data: null });
    }));
    store.dispatch(actionCreators.getTimetable())
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call getTimetable that can be failed', (done) => {
    axios.get = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.getTimetable())
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call getTimetableFriend', (done) => {
    axios.get = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 204, data: null });
    }));
    store.dispatch(actionCreators.getTimetableFriend())
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });
  it('should call getTimetableFriend that can be failed', (done) => {
    axios.get = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.getTimetableFriend())
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });
  it('should call getCourses', (done) => {
    axios.get = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 204, data: null });
    }));
    const searchValues={
      title: 'T',
      classification: 'C',
      department: 'D',
      degree_program: 'D',
      academic_year: 'A',
      course_number: 'C',
      lecture_number: 'L',
      professor: 'P',
      language: 'L',
      min_credit: 0,
      max_credit: 4,
      min_score: 0,
      max_score: 10,
    };
    store.dispatch(actionCreators.getCourses(0,49,searchValues))
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call getCourses that can be failed', (done) => {
    axios.get = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    const searchValues={
      title: 'TI',
      classification: 'CL',
      department: 'DE',
      degree_program: 'DE',
      academic_year: 'AC',
      course_number: 'CO',
      lecture_number: 'LE',
      professor: 'PR',
      language: 'LA',
      min_credit: 0,
      max_credit: 4,
      min_score: 0,
      max_score: 10,
    };
    store.dispatch(actionCreators.getCourses(0,49,searchValues))
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call postCourse', (done) => {
    axios.post = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 204, data: null });
    }));
    store.dispatch(actionCreators.postCourse())
      .then(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        done();
      });
  });
  it('should call postCourse that can be failed', (done) => {
    axios.post = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.postCourse())
      .then(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        done();
      });
  });
  it('should call postTimetable', (done) => {
    axios.post = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 204, data: null });
    }));
    store.dispatch(actionCreators.postTimetable())
      .then(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        done();
      });
  });
  it('should call postTimetable that can be failed', (done) => {
    axios.post = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.postTimetable())
      .then(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        done();
      });
  });
  it('should call postMainTimetable', (done) => {
    axios.post = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 204, data: null });
    }));
    store.dispatch(actionCreators.postMainTimetable())
      .then(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call postMainTimetable that can be failed', (done) => {
    axios.post = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.postMainTimetable())
      .then(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call deleteCourse', (done) => {
    axios.delete = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 204, data: null });
    }));
    store.dispatch(actionCreators.deleteCourse(1, 1))
      .then(() => {
        expect(axios.delete).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call deleteCourse that can be failed', (done) => {
    axios.delete = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.deleteCourse(1, 1))
      .then(() => {
        expect(axios.delete).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call postCustomCourse', (done) => {
    const courseInfo = {
      title: 'swpp',
      color: '#FF0000',
    };
    const courseTime = [[0, '15:00', '20:00']];

    axios.post = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 204, data: null });
    }));
    store.dispatch(actionCreators.postCustomCourse(1, courseInfo, courseTime))
      .then(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call postCustomCourse that can be failed', (done) => {
    const courseInfo = {
      title: 'swpp',
      color: '#FF0000',
    };
    const courseTime = [[0, '15:00', '20:00']];

    axios.post = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.postCustomCourse(1, courseInfo, courseTime))
      .then(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call deleteTimetable', (done) => {
    axios.delete = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 204, data: null });
    }));
    store.dispatch(actionCreators.deleteTimetable(1))
      .then(() => {
        expect(axios.delete).toHaveBeenCalledTimes(1);
        done();
      });
  });
  it('should call deleteTimetable', (done) => {
    axios.delete = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.deleteTimetable(1))
      .then(() => {
        expect(axios.delete).toHaveBeenCalledTimes(1);
        done();
      });
  });
  it('should call getTimetables', (done) => {
    axios.get = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 204, data: null });
    }));
    store.dispatch(actionCreators.getTimetables())
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });
  it('should call getTimetables', (done) => {
    axios.get = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.getTimetables())
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });
  it('should run .catch when signup failed', (done) => {
    axios.get = jest.fn(() => new Promise((reject) => {
      reject({ status: 401, data: null });
    }));
    store.dispatch(actionCreators.getVerify())
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should get friend when user/friend resolved', (done) => {
    axios.get = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 200, data: null });
    }));
    store.dispatch(actionCreators.getFriend())
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should not get friend when user/friend rejected', (done) => {
    axios.get = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.getFriend())
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('exist should set to true when the search succeeded', (done) => {
    axios.post = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 200, data: { user: 'x', status: 'y' } });
    }));
    store.dispatch(actionCreators.postUserSearch(''))
      .then(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(reducer.mock.results[0].value.exist).toBe(true);
        done();
      });
  });

  it('exist should be set to false when the search failed', (done) => {
    axios.post = jest.fn(() => new Promise((resolve, reject) => {
      reject({ status: 400, response: { data: '' } });
    }));
    store.dispatch(actionCreators.postUserSearch(''))
      .then(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(reducer.mock.results[0].value.exist).toBe(false);
        done();
      });
  });

  it('user_id should be set when friend delete succeeded', (done) => {
    const id = 10;
    axios.delete = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 200, response: {} });
    }));
    store.dispatch(actionCreators.deleteFriend(id))
      .then(() => {
        expect(axios.delete).toHaveBeenCalledTimes(1);
        expect(reducer.mock.results[0].value.user_id).toBe(id);
        done();
      });
  });

  it('do nothing when friend delete failed', (done) => {
    const id = 10;
    axios.delete = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.deleteFriend(id))
      .then(() => {
        expect(axios.delete).toHaveBeenCalledTimes(1);
        expect(reducer).toHaveBeenCalledTimes(0);
        done();
      });
  });

  it('user_id should be set when friend reject succeeded', (done) => {
    const id = 10;
    axios.delete = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 200, response: {} });
    }));
    store.dispatch(actionCreators.rejectFriend(id))
      .then(() => {
        expect(axios.delete).toHaveBeenCalledTimes(1);
        expect(reducer.mock.results[0].value.user_id).toBe(id);
        done();
      });
  });

  it('do nothing when friend reject failed', (done) => {
    const id = 10;
    axios.delete = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.rejectFriend(id))
      .then(() => {
        expect(axios.delete).toHaveBeenCalledTimes(1);
        expect(reducer).toHaveBeenCalledTimes(0);
        done();
      });
  });

  it('user_id should be set when friend cancel succeeded', (done) => {
    const id = 10;
    axios.delete = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 200, response: {} });
    }));
    store.dispatch(actionCreators.cancelFriend(id))
      .then(() => {
        expect(axios.delete).toHaveBeenCalledTimes(1);
        expect(reducer.mock.results[0].value.user_id).toBe(id);
        done();
      });
  });

  it('do nothing when friend cancel failed', (done) => {
    const id = 10;
    axios.delete = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.cancelFriend(id))
      .then(() => {
        expect(axios.delete).toHaveBeenCalledTimes(1);
        expect(reducer).toHaveBeenCalledTimes(0);
        done();
      });
  });

  it('user should be set when friend receive succeeded', (done) => {
    const data = '123';
    axios.post = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 200, data });
    }));
    store.dispatch(actionCreators.receiveFriend(10))
      .then(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(reducer.mock.results[0].value.user).toBe(data);
        done();
      });
  });

  it('do nothing when friend receive failed', (done) => {
    const id = 10;
    axios.post = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.receiveFriend(id))
      .then(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(reducer).toHaveBeenCalledTimes(0);
        done();
      });
  });
  it('should call getRatedCourse', (done) => {
    axios.get = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 204, data: null });
    }));
    const searchValues={
      title: 'T',
      classification: 'C',
      department: 'D',
      degree_program: 'D',
      academic_year: 'A',
      course_number: 'C',
      lecture_number: 'L',
      professor: 'P',
      language: 'L',
      min_credit: 0,
      max_credit: 4,
      min_score: 0,
      max_score: 10,
    };
    store.dispatch(actionCreators.getRatedCourse(0,49,searchValues))
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call getRatedCourse that can be failed', (done) => {
    axios.get = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    const searchValues={
      title: 'TI',
      classification: 'CL',
      department: 'DE',
      degree_program: 'DE',
      academic_year: 'AC',
      course_number: 'CO',
      lecture_number: 'LE',
      professor: 'PR',
      language: 'LA',
      min_credit: 0,
      max_credit: 4,
      min_score: 0,
      max_score: 10,
    };
    store.dispatch(actionCreators.getRatedCourse(0,49,searchValues))
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });
  it('should call getUnratedCourse', (done) => {
    axios.get = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 204, data: null });
    }));
    const searchValues={
      title: 'T',
      classification: 'C',
      department: 'D',
      degree_program: 'D',
      academic_year: 'A',
      course_number: 'C',
      lecture_number: 'L',
      professor: 'P',
      language: 'L',
      min_credit: 0,
      max_credit: 4,
      min_score: 0,
      max_score: 10,
    };
    store.dispatch(actionCreators.getUnratedCourse(0,49,searchValues))
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call getUnratedCourse that can be failed', (done) => {
    axios.get = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    const searchValues={
      title: 'TI',
      classification: 'CL',
      department: 'DE',
      degree_program: 'DE',
      academic_year: 'AC',
      course_number: 'CO',
      lecture_number: 'LE',
      professor: 'PR',
      language: 'LA',
      min_credit: 0,
      max_credit: 4,
      min_score: 0,
      max_score: 10,
    };
    store.dispatch(actionCreators.getUnratedCourse(0,49,searchValues))
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });
  it('should call setRatedCourse', (done) => {
    axios.get = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 204, data: null });
    }));
    const searchValues={
      title: 'T',
      classification: 'C',
      department: 'D',
      degree_program: 'D',
      academic_year: 'A',
      course_number: 'C',
      lecture_number: 'L',
      professor: 'P',
      language: 'L',
      min_credit: 0,
      max_credit: 4,
      min_score: 0,
      max_score: 10,
    };
    store.dispatch(actionCreators.setRatedCourse(0,49,searchValues))
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call setRatedCourse that can be failed', (done) => {
    axios.get = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    const searchValues={
      title: 'TI',
      classification: 'CL',
      department: 'DE',
      degree_program: 'DE',
      academic_year: 'AC',
      course_number: 'CO',
      lecture_number: 'LE',
      professor: 'PR',
      language: 'LA',
      min_credit: 0,
      max_credit: 4,
      min_score: 0,
      max_score: 10,
    };
    store.dispatch(actionCreators.setRatedCourse(0,49,searchValues))
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });
  it('should call setUnratedCourse', (done) => {
    axios.get = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 204, data: null });
    }));
    const searchValues={
      title: 'T',
      classification: 'C',
      department: 'D',
      degree_program: 'D',
      academic_year: 'A',
      course_number: 'C',
      lecture_number: 'L',
      professor: 'P',
      language: 'L',
      min_credit: 0,
      max_credit: 4,
      min_score: 0,
      max_score: 10,
    };
    store.dispatch(actionCreators.setUnratedCourse(0,49,searchValues))
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call setUnratedCourse that can be failed', (done) => {
    axios.get = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    const searchValues={
      title: 'TI',
      classification: 'CL',
      department: 'DE',
      degree_program: 'DE',
      academic_year: 'AC',
      course_number: 'CO',
      lecture_number: 'LE',
      professor: 'PR',
      language: 'LA',
      min_credit: 0,
      max_credit: 4,
      min_score: 0,
      max_score: 10,
    };
    store.dispatch(actionCreators.setUnratedCourse(0,49,searchValues))
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });
  
  it('should call putCoursePref', (done) => {
    axios.put = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 201, data: null });
    }));
    store.dispatch(actionCreators.putCoursepref())
      .then(() => {
        expect(axios.put).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should .catch when putCoursePref failed', (done) => {
    axios.put = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.putCoursepref())
      .then(() => {
        expect(axios.put).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call searchBuildings', (done) => {
    axios.get = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 201, data: [{name: "SNU", lat:0, lng:0, detail:''}] });
    }));
    store.dispatch(actionCreators.searchBuildings("SNU"))
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(reducer.mock.results[0].value.building_list).toStrictEqual(
          [{name: "SNU", lat:0, lng:0, detail:''}]
        )
        done();
      });
  });

  it('should .catch when searchBuildings failed', (done) => {
    axios.get = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.searchBuildings("SNU"))
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

  
  it('should call putTimePref', (done) => {
    axios.put = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 201, data: [] });
    }));
    store.dispatch(actionCreators.putTimePref([]))
      .then(() => {
        expect(axios.put).toHaveBeenCalledTimes(1);
        expect(reducer.mock.results[0].value.time_pref_table).toStrictEqual([]);
        done();
      });
  });

  it('should .catch when putTimePref failed', (done) => {
    axios.put = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.putTimePref([]))
      .then(() => {
        expect(axios.put).toHaveBeenCalledTimes(1);
        done();
      });
  });

  
  it('should call getTimePref', (done) => {
    axios.get = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 201, data: [] });
    }));
    store.dispatch(actionCreators.getTimePref())
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(reducer.mock.results[0].value.time_pref_table).toStrictEqual([])
        done();
      });
  });

  it('should .catch when getTimePref failed', (done) => {
    axios.get = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.getTimePref())
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

    
  it('should call putConstraints', (done) => {
    axios.put = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 201, data: [] });
    }));
    store.dispatch(actionCreators.putConstraints([]))
      .then(() => {
        expect(axios.put).toHaveBeenCalledTimes(1);
        expect(reducer.mock.results[0].value.constraints).toStrictEqual([]);
        done();
      });
  });

  it('should .catch when putConstraints failed', (done) => {
    axios.put = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.putConstraints([]))
      .then(() => {
        expect(axios.put).toHaveBeenCalledTimes(1);
        done();
      });
  });

  
  it('should call getConstraints', (done) => {
    axios.get = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 201, data: [] });
    }));
    store.dispatch(actionCreators.getConstraints([]))
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(reducer.mock.results[0].value.constraints).toStrictEqual([])
        done();
      });
  });

  it('should .catch when getConstraints failed', (done) => {
    axios.get = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.getConstraints([]))
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

        
  it('should call putLastPage', (done) => {
    axios.put = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 201, data: [] });
    }));
    store.dispatch(actionCreators.putLastPage([]))
      .then(() => {
        expect(axios.put).toHaveBeenCalledTimes(1);
        expect(reducer.mock.results[0].value.last_page).toStrictEqual([]);
        done();
      });
  });

  it('should .catch when putLastPage failed', (done) => {
    axios.put = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.putLastPage([]))
      .then(() => {
        expect(axios.put).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call getLastPage', (done) => {
    axios.get = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 201, data: [] });
    }));
    store.dispatch(actionCreators.getLastPage([]))
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(reducer.mock.results[0].value.last_page).toStrictEqual([])
        done();
      });
  });

  it('should .catch when getLastPage failed', (done) => {
    axios.get = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.getLastPage([]))
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

  
  it('should call getRecommend', (done) => {
    axios.get = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 201, data: [] });
    }));
    store.dispatch(actionCreators.getRecommend([]))
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(reducer.mock.results[0].value.timetables).toStrictEqual([])
        done();
      });
  });

  it('should .catch when getRecommend failed', (done) => {
    axios.get = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.getRecommend([]))
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

  
  it('should call postRecommend', (done) => {
    axios.post = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 201, data: [] });
    }));
    store.dispatch(actionCreators.postRecommend([]))
      .then(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(reducer.mock.results[0].value.timetables).toStrictEqual([])
        done();
      });
  });

  it('should .catch when postRecommend failed', (done) => {
    axios.post = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.postRecommend([]))
      .then(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        done();
      });
  });

  
  it('should call deleteRecommend', (done) => {
    axios.delete = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 201, data: [] });
    }));
    store.dispatch(actionCreators.deleteRecommend([]))
      .then(() => {
        expect(axios.delete).toHaveBeenCalledTimes(1);
        expect(reducer.mock.results[0].value.timetables).toStrictEqual([])
        done();
      });
  });

  it('should .catch when deleteRecommend failed', (done) => {
    axios.delete = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.deleteRecommend([]))
      .then(() => {
        expect(axios.delete).toHaveBeenCalledTimes(1);
        done();
      });
  });


  it('should call editTimetable', (done) => {
    axios.put = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 201, data: [] });
    }));
    store.dispatch(actionCreators.editTimetable([]))
      .then(() => {
        expect(axios.put).toHaveBeenCalledTimes(1);
        expect(reducer.mock.results[0].value.timetable).toStrictEqual([])
        done();
      });
  });

  it('should .catch when editTimetable failed', (done) => {
    axios.put = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.editTimetable([]))
      .then(() => {
        expect(axios.put).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call editCourse', (done) => {
    axios.put = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 201, data: [] });
    }));
    store.dispatch(actionCreators.editCourse(0, {}))
      .then(() => {
        expect(axios.put).toHaveBeenCalledTimes(1);
        expect(reducer.mock.results[0].value.timetable).toStrictEqual([])
        done();
      });
  });

  it('should .catch when editCourse failed', (done) => {
    axios.put = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.editCourse(0, {}))
      .then(() => {
        expect(axios.put).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call setCourses', (done) => {
    axios.get = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 201, data: [] });
    }));
    store.dispatch(actionCreators.setCourses(0, 50, {
      title: '',
      classification: '',
      department: '',
      degree_program: '',
      academic_year: '',
      course_number: '',
      lecture_number: '',
      professor: '',
      language: '',
      min_credit: '',
      max_credit: '',
      min_score: '',
      max_score: '',
    }))
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(reducer.mock.results[0].value.course_list).toStrictEqual([])
        done();
      });
  });

  it('should .catch when setCourses failed', (done) => {
    axios.get = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.setCourses(0, 50, {
      title: '',
      classification: '',
      department: '',
      degree_program: '',
      academic_year: '',
      course_number: '',
      lecture_number: '',
      professor: '',
      language: '',
      min_credit: '',
      max_credit: '',
      min_score: '',
      max_score: '',
    }
    ))
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });
});
