import { mount } from 'enzyme';
import React from 'react';
import MainPageFriendView from './MainPageFriendView';

const friend = {
  id: 1,
  name: 'KOO',
  timetable: [
    {
      title: 'SWPP',
      week_day: 2,
      start_time: 1020,
      end_time: 1110,
      course_number: 'M1522.002400',
      lecture_number: '001',
      color: '#FF0000',
    },
    {
      title: 'SWPP2',
      week_day: 3,
      start_time: 1020,
      end_time: 1110,
      course_number: 'M1522.002400',
      lecture_number: '001',
      color: '#FF0000',
    },
    {
      title: 'SWPP3',
      week_day: 3,
      start_time: 1120,
      end_time: 1210,
      course_number: 'M1522.002400',
      lecture_number: '001',
      color: '#FF0000',
    },
  ],
};

const mockDate = require('mockdate');

describe('<MainPageFriendView/>', () => {
  afterEach(() => { jest.clearAllMocks(); });

  it('MainPageFriendView render test', () => {
    mockDate.set(1573029840000);
    const component = mount(
      <MainPageFriendView friend={friend} onClick={() => {}} />,
    );
    expect(component.find('button').text()).toContain('46');
  });

  it('MainPageFriendView should render 공강 when there are no classes', () => {
    mockDate.set(1572029840000);
    const component = mount(
      <MainPageFriendView friend={friend} onClick={() => {}} />,
    );
    expect(component.find('button').text()).toContain('공강');
  });

  it('MainPageFriendView should render class when he/she is in class', () => {
    mockDate.set(1573120800000);
    const component = mount(
      <MainPageFriendView friend={friend} onClick={() => {}} />,
    );
    expect(component.find('button').text()).toContain('SWPP3');
  });

  it('MainPageFriendView should not render class when he/she is not in class', () => {
    mockDate.set(1573106580000);
    const component = mount(
      <MainPageFriendView friend={friend} onClick={() => {}} />,
    );
    expect(component.find('button').text()).not.toContain('SWPP');
  });
});
