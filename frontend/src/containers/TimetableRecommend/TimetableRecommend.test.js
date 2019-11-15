import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { mount } from 'enzyme';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';
import TimetableRecommend from './TimetableRecommend';

const stubState = {
  user: { is_authenticated: true },
};

function timetableRecommend(state) {
  const mockStore = getMockStore(state);
  const recommendlist = [
    {
      time: [
        {
          week_day: 0,
          start_time: 660,
          end_time: 750,
          name: '자료구조',
          color: '#2BC366',
          course_number: 'M1522.000900',
          lecture_number: '001',
        },
        {
          week_day: 0,
          start_time: 1020,
          end_time: 1110,
          name: '소프트웨어 개발의 원리와 실습',
          color: '#FF2312',
          course_number: 'M1522.002400',
          lecture_number: '001',
        },
        {
          week_day: 2,
          start_time: 660,
          end_time: 750,
          name: '자료구조',
          color: '#2BC366',
          course_number: 'M1522.000900',
          lecture_number: '001',
        },
        {
          week_day: 2,
          start_time: 1020,
          end_time: 1110,
          name: '소프트웨어 개발의 원리와 실습',
          color: '#FF2312',
          course_number: 'M1522.002400',
          lecture_number: '001',
        },
        {
          week_day: 4,
          start_time: 840,
          end_time: 960,
          name: '자료구조',
          color: '#2BC366',
          course_number: 'M1522.000900',
          lecture_number: '001',
        },
        {
          week_day: 0,
          start_time: 840,
          end_time: 930,
          name: '전기전자회로',
          color: '#7FFF00',
          course_number: '4190.206A',
          lecture_number: '001',
        },
        {
          week_day: 2,
          start_time: 840,
          end_time: 930,
          name: '전기전자회로',
          color: '#7FFF00',
          course_number: '4190.206A',
          lecture_number: '001',
        },
        {
          week_day: 0,
          start_time: 930,
          end_time: 1020,
          name: '컴퓨터구조',
          color: '#FFD700',
          course_number: '4190.308',
          lecture_number: '002',
        },
        {
          week_day: 2,
          start_time: 930,
          end_time: 1020,
          name: '컴퓨터구조',
          color: '#FFD700',
          course_number: '4190.308',
          lecture_number: '002',
        },
        {
          week_day: 1,
          start_time: 930,
          end_time: 990,
          name: '프로그래밍의원리',
          color: '#866BC3',
          course_number: '4190.210',
          lecture_number: '001',
        },
        {
          week_day: 3,
          start_time: 930,
          end_time: 990,
          name: '프로그래밍의원리',
          color: '#866BC3',
          course_number: '4190.210',
          lecture_number: '001',
        },
        {
          week_day: 1,
          start_time: 1110,
          end_time: 1230,
          name: '프로그래밍의원리',
          color: '#866BC3',
          course_number: '4190.210',
          lecture_number: '001',
        },
        {
          week_day: 2,
          start_time: 780,
          end_time: 840,
          name: '컴퓨터공학세미나',
          color: '#FF00FF',
          course_number: '4190.209',
          lecture_number: '001',
        },
        {
          week_day: 3,
          start_time: 1110,
          end_time: 1230,
          name: '소프트웨어 개발의 원리와 실습',
          color: '#00FFFF',
          course_number: 'M1522.002400',
          lecture_number: '001',
        },
      ],
    },
  ];
  return (
    <Provider store={mockStore}>
      <ConnectedRouter history={createBrowserHistory()}>
        <Switch>
          <Route
            path="/"
            exact
            render={() => (
              <TimetableRecommend
                timetable={recommendlist}
                closePopup={() => 1}
              />
            )}
          />
          <Route path="/login" exact render={() => <div className="Login" />} />
          <Route path="/main" exact render={() => <div className="Main" />} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

describe('TimetableRecommend test', () => {
  beforeEach(() => {
    // TimetableView.mockClear();
  });

  afterEach(() => jest.clearAllMocks());

  it('should render timetableRecommend', () => {
    const component = mount(timetableRecommend(stubState));
    expect(component.find('.recommended-timetable-space').length).toBe(1);
    expect(component.find('#save-button').length).toBe(1);
    expect(component.find('#close-button').length).toBe(1);
    component.find('.recommended-timetable-space').simulate('click');
    component.find('.recommended-timetable-space').simulate('keydown');
    component.find('#close-button').simulate('click');
  });
});
