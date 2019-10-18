import React from 'react';
import { Provider } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';
import { shallow, mount} from 'enzyme';
import { getMockStore } from '../../test-utils/mocks';
import { ConnectedRouter } from 'connected-react-router';
import { history } from '../../store/store'
import Main from './Main';

import * as actionCreators from '../../store/actions/user';

const stubState = {
    user: {is_authenticated: true}
};

const mockStore = getMockStore(stubState);

describe('<Main />', () => {
    let main, spyGetUser, spyGetSignout;

    beforeEach(() => {
        main = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route path='/' exact component={Main} />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
        spyGetUser = jest.spyOn(actionCreators, 'getUser')
            .mockImplementation(() => { return dispatch => {}});
        spyGetSignout = jest.spyOn(actionCreators, 'getSignout')
            .mockImplementation(() => { return dispatch => {}});
    });

    afterEach(() => { jest.clearAllMocks() });

    it('Main page render test', () => {
        const component = mount(main);
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
});