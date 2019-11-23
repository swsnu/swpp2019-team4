import { mount } from 'enzyme';
import React from 'react';
import TimetableView from './TimetableView';

jest.mock('../../containers/CourseDetail/CourseDetail', () => jest.fn((props) => (
  <div className="CourseDetail" id={props.id}>
    {props.course.title}
  </div>
)));

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

describe('<TimetableView />', () => {
  it('TimetableView render test', () => {
    const trueobject = true;
    const componentFT = mount(
      <TimetableView
        courses={courses}
        height={24}
        text={false}
        link={trueobject}
      />,
    );
    const componentTF = mount(
      <TimetableView
        courses={courses}
        height={24}
        text={trueobject}
        link={false}
      />,
    );
    const datastructureFT = componentFT.find('.square');
    expect(datastructureFT.length).toBe(3);
    const datastructureTF = componentTF.find('.square');
    expect(datastructureTF.length).toBe(3);
  });

  it('shows course info when clicked the button', () => {
    const component = mount(
      <TimetableView
        courses={courses}
        height={24}
        text={false}
        link
      />,
    );
    const button = component.find('.square').at(0);
    button.simulate('click');
    expect(component.find('.CourseDetail').text()).toBe('자료구조');
  });

  it('shows course info when keyDown', () => {
    const component = mount(
      <TimetableView
        courses={courses}
        height={24}
        text={false}
        link
      />,
    );
    const button = component.find('.square').at(0);
    button.simulate('keyDown');
    expect(component.find('.CourseDetail').text()).toBe('자료구조');
  });
});
