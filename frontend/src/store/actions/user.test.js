import * as actionCreators from '../actions/index';
import axios from 'axios';
import store from '../store';

describe('user action test', () => {
    beforeEach(() => {
        axios.post = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200, data: null
                };
                resolve(result);
            })
        })
        axios.get = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200, data: null
                };
                resolve(result);
            })
        })
    })

    afterEach(() => { jest.clearAllMocks() });

    it('should call postSignin', (done) => {
        store.dispatch(actionCreators.postSignin())
            .then(() => {
                expect(axios.post).toHaveBeenCalledTimes(1);
                done();
            })
    }) 

    it('should call getSignout', (done) => {
        store.dispatch(actionCreators.getSignout())
            .then(() => {
                expect(axios.get).toHaveBeenCalledTimes(1);
                done();
            })
    }) 

    it('should call getUser', (done) => {
        store.dispatch(actionCreators.getUser())
            .then(() => {
                expect(axios.get).toHaveBeenCalledTimes(1);
                done();
            })
    }) 
})