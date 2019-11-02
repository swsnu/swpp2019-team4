import { mount } from 'enzyme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import TopBar from './TopBar';

describe('<TimeTableView />', () => {
  it('TimeTableView render test', () => {
    const component = mount(<BrowserRouter><TopBar /></BrowserRouter>);
    const assabutton = component.find('#assa-logo-button');
    const timetablebutton = component.find('#timetable-management-button');
    const friendbutton = component.find('#friend-button');
    const informationbutton = component.find('#personal-information-button');
    expect(assabutton.length).toBe(1);
    expect(timetablebutton.length).toBe(1);
    expect(friendbutton.length).toBe(1);
    expect(informationbutton.length).toBe(1);
  });
});
