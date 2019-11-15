import { mount } from 'enzyme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import TopBar from './TopBar';

describe('<TimetableView />', () => {
  it('TimetableView render test', () => {
    const component = mount(<BrowserRouter><TopBar logout={() => {}} /></BrowserRouter>);
    const assabutton = component.find('#assa-logo-button');
    const managementbutton = component.find('#timetable-management-button');
    const recommendationbutton = component.find('#timetable-recommendation-button');
    const informationbutton = component.find('#personal-information-button');
    expect(assabutton.length).toBe(4);
    expect(managementbutton.length).toBe(4);
    expect(recommendationbutton.length).toBe(4);
    expect(informationbutton.length).toBe(4);
  });
});
