import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { mount } from 'enzyme';
import { getMockStore } from '../../test-utils/mocks';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import Main from './Main';

import * as actionCreators from '../../store/actions/user';

const stubState = {
    user: {is_authenticated: true}
};

const stubStateFalse = {
    user: {is_authenticated: false}
};

function window(stubState) {
    const mockStore = getMockStore(stubState);
    return (
        <Provider store={mockStore}>
            <ConnectedRouter history={createBrowserHistory()}>
                <Switch>
                    <Route path='/' exact component={Main} />
                    <Route path='/login' exact render={() => <div className='Login'/>} />
                </Switch>
            </ConnectedRouter>
        </Provider>
    );
};

describe('<Main />', () => {
    let spyGetUser, spyGetSignout;
    
    beforeEach(() => {
        spyGetUser = jest.spyOn(actionCreators, 'getUser')
            .mockImplementation(() => { return dispatch => {}});
        spyGetSignout = jest.spyOn(actionCreators, 'getSignout')
            .mockImplementation(() => { return dispatch => {}});
    });

    afterEach(() => { jest.clearAllMocks() });

    it('Main page render test', () => {
        const component = mount(window(stubState));
        const assabutton=component.find('#assa-logo-button');
        const timetablebutton=component.find('#timetable-management-button');
        const friendbutton = component.find('#friend-button');
        const informationbutton = component.find('#personal-information-button');
        const logoutbutton = component.find('#logout-button');
        const timetable = component.find('#timetable-table');
        const friendlist = component.find('#friend-list');
        expect(assabutton.length).toBe(1);
        expect(timetablebutton.length).toBe(1);
        expect(friendbutton.length).toBe(1);
        expect(informationbutton.length).toBe(1);
        expect(logoutbutton.length).toBe(1);
        expect(timetable.length).toBe(1);
        expect(friendlist.length).toBe(1);
    });

    it('should call signout when pressed logout button', () => {
        const component = mount(window(stubState));
        component.find('#logout-button').simulate('click');
        expect(spyGetSignout).toBeCalledTimes(1);
    });

    it('should redirect to login when is_authenticated is false', () => {
        const component = mount(window(stubStateFalse));
        expect(component.find('.Login').length).toBe(1);
    });
});