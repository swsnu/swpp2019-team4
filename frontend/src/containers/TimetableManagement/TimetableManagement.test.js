import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { mount } from 'enzyme';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';
import TimetableManagement from './TimetableManagement';

import * as actionCreators from '../../store/actions/user';

jest.mock('../TimetableRecommend/TimetableRecommend');
const stubState = {
  user: {
    is_authenticated: true,
    timetable_main: 1,
  },
  timetables: [
    {
      id: 1,
      title: 'my timetable',
      semester: '2019-2',
      course: [],
    },
  ],
  courses: [{
    id: 0,
    title: '자료구조',
    color: '#2BC366',
    course_number: 'M1522.000900',
    lecture_number: '001',
    time: [{
      week_day: 0,
      start_time: 660,
      end_time: 750,
    }],
  }],
  timetable: {
    course: [],
  },
};
const stubStateFalse = {
  user: {
    is_authenticated: false,
    timetable_main: 0,
  },
  timetables: [],
  courses: [],
  timetable: {
    courses: [],
  },
};
function timetableManagement(state) {
  const mockStore = getMockStore(state);
  return (
    <Provider store={mockStore}>
      <ConnectedRouter history={createBrowserHistory()}>
        <Switch>
          <Route
            path="/"
            exact
            render={() => <TimetableManagement courses={[]} height={24} width={80} text link title="" />}
          />
          <Route path="/login" exact render={() => <div className="Login" />} />
          <Route path="/main" exact render={() => <div className="Main" />} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

describe('TimetableManagement test', () => {
  let spyGetUser;
  let spyGetSignout;
  let spyGetTimetables;
  let spyGetCourses;
  let spyGetTimetable;
  let spyPostTimetable;
  let spyPostCourse;
  beforeEach(() => {
    spyGetUser = jest.spyOn(actionCreators, 'getUser')
      .mockImplementation(() => () => Promise.resolve(null));
    spyGetSignout = jest.spyOn(actionCreators, 'getSignout')
      .mockImplementation(() => () => {});
    spyGetTimetables = jest.spyOn(actionCreators, 'getTimetables')
      .mockImplementation(() => () => {});
    spyGetCourses = jest.spyOn(actionCreators, 'getCourses')
      .mockImplementation(() => () => {});
    spyGetTimetable = jest.spyOn(actionCreators, 'getTimetable')
      .mockImplementation(() => () => {});
    spyPostTimetable = jest.spyOn(actionCreators, 'postTimetable')
      .mockImplementation(() => () => {});
    spyPostCourse = jest.spyOn(actionCreators, 'postCourse')
      .mockImplementation(() => () => {});
    // TimetableRecommend.mockClear();
  });

  afterEach(() => jest.clearAllMocks());

  it('should call componentDidMount', () => {
    mount(timetableManagement(stubState));
    expect(spyGetUser).toBeCalledTimes(1);
    expect(spyGetTimetables).toBeCalledTimes(1);
  });

  it('should render timetableManagement', () => {
    const component = mount(timetableManagement(stubState));
    expect(component.find('#topbar').length).toBe(1);
    expect(component.find('#logout-button').length).toBe(1);
    expect(component.find('#semester-select').length).toBe(1);
    expect(component.find('#courses').length).toBe(1);
    expect(component.find('#timetable-table').length).toBe(1);
    expect(component.find('#delete-button').length).toBe(1);
    expect(component.find('#create-button').length).toBe(1);
    expect(component.find('#timetable-recommend-button').length).toBe(1);
    component.find('#timetable-recommend-button').simulate('click');
  });

  it('should call postTimetable when pressed create-button', () => {
    const component = mount(timetableManagement(stubState));
    component.find('#create-button').simulate('click');
    expect(spyPostTimetable).toBeCalledTimes(1);
  });

  it('should not call post when pressed postCourse button', () => {
    const component = mount(timetableManagement(stubState));
    component.find('.course-list').find('button').simulate('click');
    expect(spyPostCourse).toBeCalledTimes(0);
    expect(spyGetTimetables).toBeCalledTimes(1);
    expect(spyGetTimetable).toBeCalledTimes(0);
  });

  it('should call post when pressed postCourse button', async () => {
    const component = await mount(timetableManagement(stubState));
    component.find('.timetable-list').find('button').simulate('click');
    component.find('.result-button').find('button').simulate('click');
    component.find('.course-list').find('button').simulate('click');
    expect(spyPostCourse).toBeCalledTimes(1);
    expect(spyGetTimetables).toBeCalledTimes(1);
    expect(spyGetTimetable).toBeCalledTimes(3);
  });

  it('should call show when pressed createTimetable button', () => {
    const component = mount(timetableManagement(stubState));
    component.find('.timetable-list').find('button').simulate('click');
    expect(spyGetTimetable).toBeCalledTimes(1);
  });

  it('should call signout when pressed logout button', () => {
    const component = mount(timetableManagement(stubState));
    component.find('#logout-button').simulate('click');
    expect(spyGetSignout).toBeCalledTimes(1);
  });

  it('should call search when pressed search button', () => {
    const component = mount(timetableManagement(stubState));
    component.find('.search').simulate('click');
    expect(spyGetCourses).toBeCalledTimes(1);
  });

  it('should change value when typing in search', () => {
    const component = mount(timetableManagement(stubState));
    component.find('#courses').simulate('change', 'asdf');
  });
  it('should redirect to login when is_authenticated is false', () => {
    const component = mount(timetableManagement(stubStateFalse));
    expect(component.find('.Login').length).toBe(1);
  });
});
