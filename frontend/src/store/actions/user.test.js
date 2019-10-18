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
    })

    it('should call postSignin', () => {
        store.dispatch(actionCreators.postSignin())
            .then(() => {
                expect(axios.post).toHaveBeenCalledTimes(1);
                done();
            })
    }) 
})