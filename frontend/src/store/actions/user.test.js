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

  it('should call getCourses', (done) => {
    axios.get = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 204, data: null });
    }));
    store.dispatch(actionCreators.getCourses())
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call getCourses that can be failed', (done) => {
    axios.get = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    store.dispatch(actionCreators.getCourses())
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
  it('should call getTimetableData', (done) => {
    axios.get = jest.fn(() => new Promise((resolve) => {
      resolve({ status: 204, data: null });
    }));
    store.dispatch(actionCreators.getTimetableData())
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
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
});
