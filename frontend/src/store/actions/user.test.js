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
    const spyAlert = jest.spyOn(window, 'alert')
      .mockImplementation(() => {});
    store.dispatch(actionCreators.postSignup())
      .then(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(spyAlert).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should run .catch when signup failed', (done) => {
    axios.post = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    const spyAlert = jest.spyOn(window, 'alert')
      .mockImplementation((message) => (message === '메일을 발송하지 못했습니다. 이메일을 다시 한 번 확인해 주시기 바랍니다.'));
    store.dispatch(actionCreators.postSignup())
      .then(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(spyAlert).toHaveBeenCalledTimes(1);
        expect(spyAlert.mock.results[0].value).toBe(true);
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
    const spyAlert = jest.spyOn(window, 'alert')
      .mockImplementation(() => {});
    store.dispatch(actionCreators.postSignin())
      .then(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(spyAlert).toHaveBeenCalledTimes(1);
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
    const spyAlert = jest.spyOn(window, 'alert')
      .mockImplementation(() => {});
    store.dispatch(actionCreators.getVerify())
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(spyAlert).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should run .catch when signup failed', async (done) => {
    axios.get = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error(''));
    }));
    const spyAlert = await jest.spyOn(window, 'alert')
      .mockImplementation((message) => (message === '부적절한 요청입니다.'));
    store.dispatch(actionCreators.getVerify())
      .then(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(spyAlert).toHaveBeenCalledTimes(1);
        expect(spyAlert.mock.results[0].value).toBe(true);
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
});
