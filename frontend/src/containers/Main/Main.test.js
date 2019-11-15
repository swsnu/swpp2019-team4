import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { mount } from 'enzyme';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';
import Main from './Main';

import * as actionCreators from '../../store/actions/user';

const stubState = {
  user: { is_authenticated: true, timetable_main: 0 },
  timetables: [
    {
      id: 0,
      course: [{
        id: 0,
        color: '#FFFFFF',
        lecture_number: 'LN',
        course_number: 'CN',
        time: [
          {
            week_day: 0,
            start_time: 660,
            end_time: 690,
          },
        ],
      }],
    },
  ],
};

const stubStateFalse = {
  user: { is_authenticated: false, timetable_main: 0 },
  timetables: [{
    course: [{ time: [{}] }],
  }],
};

const stubStateNone = {
  user: { is_authenticated: true, timetable_main: 0 },
  timetables: [{
    course: [{ time: [{}] }],
  }],
};

const stubStateUndefined = {
  user: { is_authenticated: true, timetable_main: 0 },
};

function window(state) {
  const mockStore = getMockStore(state);
  return (
    <Provider store={mockStore}>
      <ConnectedRouter history={createBrowserHistory()}>
        <Switch>
          <Route path="/" exact component={Main} />
          <Route path="/login" exact render={() => <div className="Login" />} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

jest.mock('../../components/TopBar/TopBar', () => jest.fn((props) => (
  <div className="TopBar">
    <button type="button" className="text-black-50" id="logout-button" onClick={() => props.logout()}>
      x
    </button>
  </div>
)));

jest.mock('../../components/TimetableView/TimetableView', () => jest.fn((props) => (
  <div>
    {props.courses.map((x) => <button id="fake-course" type="button" key={1}>{x.course_id}</button>)}
  </div>
)));

describe('<Main />', () => {
  let spyGetSignout;

  beforeEach(() => {
    spyGetSignout = jest.spyOn(actionCreators, 'getSignout')
      .mockImplementation(() => () => {});
  });

  afterEach(() => { jest.clearAllMocks(); });

  it('Main page render test', () => {
    const component = mount(window(stubState));
    const topbar = component.find('.TopBar');
    const timetable = component.find('#timetable-table');
    expect(topbar.length).toBe(1);
    expect(timetable.length).toBe(1);
    expect(component.find('#fake-course').length).toBe(1);
  });

  it('should call friend timetable when pressed friend button', () => {
    const component = mount(window(stubState));
    component.find('#friend-status').at(0).simulate('click');
    component.find('#close-button').at(0).simulate('click');
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

  it('should render with empty list', () => {
    const component = mount(window(stubStateNone));
    expect(component.find('#fake-course').length).toBe(0);
  });

  it('should render with undefineds', () => {
    const component = mount(window(stubStateUndefined));
    expect(component.find('#fake-course').length).toBe(0);
  });
});
