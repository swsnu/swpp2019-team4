import { mount } from 'enzyme';
import React from 'react';
import TimetableView from './TimetableView';
import TimetableGenerator from '../TimetableGenerator/TimetableGenerator';

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
    const componentFT = mount(<TimetableView courses={courses} height={24} width={80} text={false} link={true} title="" />);
    const componentTF = mount(<TimetableView courses={courses} height={24} width={80} text={true} link={false} title="" />);
    const datastructureFT = componentFT.find('.square');
    expect(datastructureFT.length).toBe(6);
    const datastructureTF = componentTF.find('.square');
    expect(datastructureTF.length).toBe(6);
  });
  it('TimetableView zero render test', () => {
    const courses = TimetableGenerator(-1);
    const component = mount(<TimetableView courses={courses} height={24} width={80} text={false} link title="" />);
    const datastructure = component.find('.square');
    expect(datastructure.length).toBe(0);
  });
});
