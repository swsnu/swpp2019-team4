import React from 'react'
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import Login from './Login';
import { Route, Redirect, Switch } from 'react-router-dom';

import { getMockStore } from '../../test-utils/mocks';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import * as actionCreators from '../../store/actions/user';

const stubState = {
    user: {is_authenticated: false}
};

const stubStateTrue = {
    user: {is_authenticated: true}
};

function login(stubState) {
    const mockStore = getMockStore(stubState);
    return (
        <Provider store={mockStore}>
            <ConnectedRouter history={createBrowserHistory()}>
                <Switch>
                    <Route path='/' exact component={Login} />
                    <Route path='/signup' exact component={() => <div className='Signup'/>} />
                    <Route path='/main' exact render={() => <div className='Main'/>} />
                </Switch>
            </ConnectedRouter>
        </Provider>
    );
};

describe('<Login />', () => {
    let spyPostSignin, spyGetUser;

    beforeEach(() => {
        spyPostSignin = jest.spyOn(actionCreators, 'postSignin')
            .mockImplementation((email, password) => { return dispatch => {
                return Promise.resolve(null);
            } 
        });
        spyGetUser = jest.spyOn(actionCreators, 'getUser')
            .mockImplementation(() => { return dispatch => {}});
    });

    afterEach(() => { jest.clearAllMocks() });

    it('should render login', () => {
        const component = mount(login(stubState));
        const wrapper = component.find('.Login');
        expect(wrapper.length).toBe(1);
    });

    it('should call postsignin when fill inappropriate email and pw', async () => {
        const email = 'cubec@snu.ac.kr';
        const password = 'cubec';
        const component = mount(login(stubState));
        component.find('#email-input').simulate('change', {target: {value: email}});
        component.find('#pw-input').simulate('change', {target: {value: password}});
        await component.find('#login-button').simulate('click');
        expect(spyPostSignin).toBeCalledTimes(1);
    });

    it('should redirect to /main when logged_in is true', () => {
        const component = mount(login(stubStateTrue));
        expect(component.find('.Main').length).toBe(1);
    });

    it('should redirect to /signup when to-signup-button is clicked', () => {
        const component = mount(login(stubState));
        component.find('#to-signup-button').simulate('click');
        expect(component.find('.Signup').length).toBe(1);
    });
});