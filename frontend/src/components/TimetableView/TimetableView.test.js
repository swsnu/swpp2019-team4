import { mount } from 'enzyme';
import React from 'react';
import TimetableView from './TimetableView';

describe('<TimetableView />', () => {
  it('TimetableView render test', () => {
    const courses = [
      {
        week_day: 0, start_time: 660, end_time: 750, course_name: 'DS', color: '#FFFFFF',
      },
      {
        week_day: 0, start_time: 1020, end_time: 1110, course_name: 'swpp', color: '#000000',
      },
      {
        week_day: 2, start_time: 660, end_time: 750, course_name: 'DS', color: '#FFFFFF',
      },
      {
        week_day: 2, start_time: 1020, end_time: 1110, course_name: 'swpp', color: '#000000',
      },
      {
        week_day: 3, start_time: 1110, end_time: 1230, course_name: 'swpp', color: '#000000',
      },
      {
        week_day: 4, start_time: 840, end_time: 960, course_name: 'DS', color: '#FFFFFF',
      },
    ];
    const componentFT = mount(<TimetableView courses={courses} height={24} width={80} text={false} link title="" />);
    const componentTF = mount(<TimetableView courses={courses} height={24} width={80} text link={false} title="" />);
    const datastructureFT = componentFT.find('.square');
    expect(datastructureFT.length).toBe(6);
    const datastructureTF = componentTF.find('.square');
    expect(datastructureTF.length).toBe(6);
  });
});
