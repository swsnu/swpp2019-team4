import * as actionCreators from '../actions/index';
import axios from 'axios';
import store from '../store';

describe('user action test', () => {
    beforeEach(() => {});

    afterEach(() => { jest.clearAllMocks() });

    it('should call postSignin', (done) => {
        axios.post = jest.fn(url => {
            return new Promise((resolve, reject) => {
                resolve({status: 200, data: null});
            })
        });
        store.dispatch(actionCreators.postSignin())
            .then(() => {
                expect(axios.post).toHaveBeenCalledTimes(1);
                done();
            });
    }) 

    it('should call alert when signin failed', (done) => {
        axios.post = jest.fn(url => {
            return new Promise((resolve, reject) => {
                reject({status: 401, data: null});
            })
        });
        const spyAlert = jest.spyOn(window, 'alert')
            .mockImplementation(() => {});
        store.dispatch(actionCreators.postSignin())
            .then(() => {
                expect(axios.post).toHaveBeenCalledTimes(1);
                expect(spyAlert).toHaveBeenCalledTimes(1);
                done();
            });
    }) 

    it('should call getSignout', (done) => {
        axios.get = jest.fn(url => {
            return new Promise((resolve, reject) => {
                resolve({status: 200, data: null});
            })
        });
        store.dispatch(actionCreators.getSignout())
            .then(() => {
                expect(axios.get).toHaveBeenCalledTimes(1);
                done();
            });
    }) 

    it('should call getSignout that can be failed', (done) => {
        axios.get = jest.fn(url => {
            return new Promise((resolve, reject) => {
                reject({status: 401, data: null});
            })
        });
        store.dispatch(actionCreators.getSignout())
            .then(() => {
                expect(axios.get).toHaveBeenCalledTimes(1);
                done();
            });
    }) 

    it('should call getUser', (done) => {
        axios.get = jest.fn(url => {
            return new Promise((resolve, reject) => {
                resolve({status: 200, data: null});
            })
        });
        store.dispatch(actionCreators.getUser())
            .then(() => {
                expect(axios.get).toHaveBeenCalledTimes(1);
                done();
            })
    }) 

    it('should call getUser that can be failed', (done) => {
        axios.get = jest.fn(url => {
            return new Promise((resolve, reject) => {
                reject({status: 401, data: null});
            })
        });
        store.dispatch(actionCreators.getUser())
            .then(() => {
                expect(axios.get).toHaveBeenCalledTimes(1);
                done();
            });
    }) 
})