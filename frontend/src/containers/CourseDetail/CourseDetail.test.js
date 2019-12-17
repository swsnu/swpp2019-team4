import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';
import CourseDetail from './CourseDetail';

const dbCourse = {
  title: '자료구조',
  color: '#2BC366',
  course_number: 'M1522.000900',
  lecture_number: '001',
  time: [{
    week_day: 0,
    start_time: 660,
    end_time: 750,
    building: {
      name: '302',
      detail: '208',
    },
  },
  {
    week_day: 2,
    start_time: 660,
    end_time: 750,
    building: {
      name: '302',
      detail: '208',
    },
  },
  {
    week_day: 4,
    start_time: 840,
    end_time: 960,
    building: {
      name: '302',
      detail: '208',
    },
  },
  ],
};

const stubState = {
  user: {
    is_authenticated: true,
    timetable_main: 1,
  },
  timetables: [
    {
      id: 1,
      title: 'my timetable',
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
    title: '',
    course: [{
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
  },
  buildingList: [],
};

function window(course) {
  const mockStore = getMockStore(stubState);
  return (
    <Provider store={mockStore}>
      <ConnectedRouter history={createBrowserHistory()}>
        <Switch>
          <Route path="/" exact render={() => <CourseDetail id="" course={course} />} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

jest.mock('./CourseMap/CourseMap', () => jest.fn(() => (
  <div className="CourseMap" />
)));

describe('<CourseDetail />', () => {
  it('CourseDetail render test', () => {
    const component = mount(window(dbCourse));
    const courseDetail = component.find('.CourseDetail');
    expect(courseDetail.length).toBe(1);
    expect(component.find('#show-position-button').length).toBe(3);
    component.find('#show-position-button').at(0).simulate('click');
  });
});
