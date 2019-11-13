import { mount } from 'enzyme';
import React from 'react';
import SideView from './SideView';

const list = [
  { title: 'title' },
];
describe('<SideView />', () => {
  afterEach(() => { jest.clearAllMocks(); });
  it('should render SideView', () => {
    const component = mount(
      <SideView list={list} className="className" onClick={() => {}} />,
    );
    expect(component.find('ul').find('button').text()).toContain('title');
  });

  it('should click onClick', () => {
    const onClick = jest.fn();
    const component = mount(
      <SideView list={list} className="className" onClick={onClick} />,
    );
    component.find('ul').find('button').simulate('click');
    expect(onClick).toHaveBeenCalled();
  });
});
