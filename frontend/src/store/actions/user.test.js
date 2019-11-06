import axios from 'axios';
import * as actionCreators from './index';
import store from '../store';

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
    axios.post = jest.fn(() => new Promise((reject) => {
      reject({ status: 401, data: null });
    }));
    store.dispatch(actionCreators.postSignup())
      .then(() => {
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
    axios.post = jest.fn(() => new Promise((reject) => {
      reject({ status: 401, data: null });
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
    axios.get = jest.fn(() => new Promise((reject) => {
      reject({ status: 401, data: null });
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
    axios.get = jest.fn(() => new Promise((reject) => {
      reject({ status: 401, data: null });
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
});
