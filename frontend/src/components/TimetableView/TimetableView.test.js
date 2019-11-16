import { mount } from 'enzyme';
import React from 'react';
import TimetableView from './TimetableView';

describe('<TimetableView />', () => {
  it('TimetableView render test', () => {
    const trueobject = true;
    const courses = [
      {
        time: [{
          week_day: 0,
          start_time: 660,
          end_time: 750,
        },
        {
          week_day: 2,
          start_time: 660,
          end_time: 750,
        },
        {
          week_day: 4,
          start_time: 840,
          end_time: 960,
        },
        ],
        title: '자료구조',
        color: '#2BC366',
        course_number: 'M1522.000900',
        lecture_number: '001',
      },
    ];
    const componentFT = mount(
      <TimetableView
        courses={courses}
        height={24}
        width={80}
        text={false}
        link={trueobject}
        title=""
      />,
    );
    const componentTF = mount(
      <TimetableView
        courses={courses}
        height={24}
        width={80}
        text={trueobject}
        link={false}
        title=""
      />,
    );
    const datastructureFT = componentFT.find('.square');
    expect(datastructureFT.length).toBe(3);
    const datastructureTF = componentTF.find('.square');
    expect(datastructureTF.length).toBe(3);
  });
});
