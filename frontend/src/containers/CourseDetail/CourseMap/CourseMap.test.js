import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { getMockStore } from '../../../test-utils/mocks';
import CourseMap from './CourseMap';

const stubState = {};

function window() {
  const mockStore = getMockStore(stubState);
  return (
    <Provider store={mockStore}>
      <CourseMap />
    </Provider>
  );
}

describe('<CourseMap />', () => {
  it('CourseMap render test', () => {
    const component = mount(window());
    const courseMap = component.find('.CourseMap');
    expect(courseMap.length).toBe(1);
  });
});
