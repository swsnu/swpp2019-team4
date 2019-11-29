import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { mount } from 'enzyme';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';
import Friend from './Friend';

import * as actionCreators from '../../store/actions/user';

const stubState = {
  user: { is_authenticated: true },
  search: {
    exist: false,
    status: '',
    username: '',
  },
  friend: [
    {
      id: 0,
      name: '정재윤',
      email: 'cubec@gmail.com',
      timetable_main: {
        course: [{
          title: '소개원실 (테스트용)',
          time: [{
            week_day: 3,
            start_time: 1110,
            end_time: 1170,
          }],
          course_number: 'M1522.002400',
          lecture_number: '001',
          color: '#FF0000',
        }],
      },
    },
    {
      id: 1,
      name: '구준서',
      email: 'ookoo@gmail.com',
      timetable_main: {
        course: [{
          title: '소개원실 (테스트용)',
          time: [{
            week_day: 3,
            start_time: 1110,
            end_time: 1170,
          }],
          course_number: 'M1522.002400',
          lecture_number: '001',
          color: '#FF0000',
        }],
      },
    },
  ],
  friend_send: [
    {
      id: 2,
      name: '김영찬',
      email: 'paden@gmail.com',
    }],
  friend_receive: [
    {
      id: 3,
      name: '김현수',
      email: 'khsoo@gmail.com',
    }],
};

const stubStateFalse = {
  user: { is_authenticated: false, timetable_main: 0 },
  friend: [],
  friend_receive: [],
  friend_send: [],
  search: {
    exist: false,
    status: '',
    username: '',
  },
};

function window(state) {
  const mockStore = getMockStore(state);
  return (
    <Provider store={mockStore}>
      <ConnectedRouter history={createBrowserHistory()}>
        <Switch>
          <Route path="/" exact component={Friend} />
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
  <div className="TimetableView">
    {props.courses.map((x) => <button id="fake-course" type="button" key={1}>{x.course_id}</button>)}
  </div>
)));

describe('<Friend />', () => {
  let spyGetSignout;

  beforeEach(() => {
    spyGetSignout = jest.spyOn(actionCreators, 'getSignout')
      .mockImplementation(() => () => {});
  });

  afterEach(() => { jest.clearAllMocks(); });

  it('Friend page render test', () => {
    const component = mount(window(stubState));
    const topbar = component.find('.TopBar');
    const timetable = component.find('.TimetableView');
    expect(topbar.length).toBe(1);
    expect(timetable.length).toBe(1);
    expect(component.find('#fake-course').length).toBe(1);
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
