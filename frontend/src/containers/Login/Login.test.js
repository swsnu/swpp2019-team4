import React from 'react'
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import Login from './Login';
import { Route, Redirect, Switch } from 'react-router-dom';

import { getMockStore } from '../../test-utils/mocks';
import { ConnectedRouter } from 'connected-react-router';
import { history } from '../../store/store'

import * as actionCreators from '../../store/actions/user';

const stubState = {
    user: {is_authenticated: false}
};

const mockStore = getMockStore(stubState);

describe('<Login />', () => {
    let login, spyPostSignin, spyGetUser;

    beforeEach(() => {
        login = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route path='/' exact component={Login} />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
        spyPostSignin = jest.spyOn(actionCreators, 'postSignin')
            .mockImplementation((email, password) => { return dispatch => {
                    if(email === 'cubec@snu.ac.kr' && password === 'cubec') {
                        return Promise.resolve({status: 204});
                    } else {
                        return Promise.reject({status: 401});
                    }
            } 
        });
        spyGetUser = jest.spyOn(actionCreators, 'getUser')
            .mockImplementation(() => { return dispatch => {}});
    });

    afterEach(() => { jest.clearAllMocks() });

    it('should render login', () => {
        const component = mount(login);
        const wrapper = component.find('.Login');
        expect(wrapper.length).toBe(1);
    });

    it('should flag as logged_in when fill appropiate email and pw', async () => {
        const email = 'cubec@snu.ac.kr';
        const password = 'cubec';
        const component = mount(login);
        const spyAlert = jest.spyOn(window, 'alert')
            .mockImplementation(() => {});
        component.find('#email-input').simulate('change', {target: {value: email}});
        component.find('#pw-input').simulate('change', {target: {value: password}});
        component.find('#login-button').simulate('click');
        const result = await spyPostSignin.mock.results[0].value()
            .then(() => true).catch(() => false);
        expect(result).toBe(true);
    });

    it('should flag as not logged_in when fill inappropriate email and pw', async () => {
        const email = 'cubec@snu.ac.kr';
        const password = 'cubec1';
        const component = mount(login);
        const spyAlert = jest.spyOn(window, 'alert')
            .mockImplementation(() => {});
        component.find('#email-input').simulate('change', {target: {value: email}});
        component.find('#pw-input').simulate('change', {target: {value: password}});     
        component.find('#login-button').simulate('click');
        const result = await spyPostSignin.mock.results[0].value()
            .then(() => true).catch(() => false);
        expect(result).toBe(false);
    });

    it('should redirect to /main when logged_in is true', () => {
        const stubInitialState = {
            user: {is_authenticated: true}
        };
        const mockInitialStore = getMockStore(stubInitialState);
        const component = mount(
            <Provider store={mockInitialStore}>
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route path='/' exact component={Login} />
                        <Route path='/main' exact render={() => <div className='Main'/>}/>
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
        expect(component.find('.Main').length).toBe(1);
    });
});