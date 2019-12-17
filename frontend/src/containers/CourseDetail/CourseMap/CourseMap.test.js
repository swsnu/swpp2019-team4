import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { getMockStore } from '../../../test-utils/mocks';
import CourseMap from './CourseMap';

const stubState = {
  buildingList: [{name:'301',lat:1,lng:1}],
};

function window(editable,building) {
  const mockStore = getMockStore(stubState);
  return (
    <Provider store={mockStore}>
      <CourseMap onChange={()=>{}} editable={editable} building={building}/>
    </Provider>
  );
}

describe('<CourseMap />', () => {
  it('CourseMap render test', () => {
    const component = mount(window(true,{ name: '', detail: '', lat: 1, lng: 1 }));
    const courseMap = component.find('.CourseMap');
    expect(courseMap.length).toBe(1);
    expect(component.find('#coursemap-building-input').length).toBe(1);
    component.find('#coursemap-building-input').simulate('change',{target:{value:'SNU'}});
    component.find('#coursemap-building-input').simulate('keydown',{keyCode:13});
    expect(component.find('#building-search-button').length).toBe(1);
    component.find('#building-search-button').simulate('click');
    expect(component.find('#detail-position-input').length).toBe(1);
    component.find('#detail-position-input').simulate('change',{target:{value:'SNU'}});
  });
  it('CourseMap render test', () => {
    const component = mount(window(false,{ name: '', detail: '', lat: 1, lng: 1 }));
    const courseMap = component.find('.CourseMap');
    expect(courseMap.length).toBe(1);
    expect(component.find('#detail-position-input').length).toBe(0);
    expect(component.find('#building-search-button').length).toBe(0);
  });
  it('CourseMap render test', () => {
    const component = mount(window(false,{ name: '', detail: ''}));
    const courseMap = component.find('.CourseMap');
    expect(courseMap.length).toBe(1);
    expect(component.find('#detail-position-input').length).toBe(0);
    expect(component.find('#building-search-button').length).toBe(0);
  });
});
