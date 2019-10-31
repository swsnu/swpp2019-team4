import {mount} from 'enzyme';
import TimeTableView from './TimeTableView';
import React from 'react';
describe('<TimeTableView />', () => {
    it('TimeTableView render test', () => {
        var courses=[
            {"week_day": 0, "start_time": 660, "end_time": 750, "course_name": "DS", "color": "#FFFFFF"},
            {"week_day": 0, "start_time": 1020, "end_time": 1110, "course_name": "swpp", "color": "#000000"},
            {"week_day": 2, "start_time": 660, "end_time": 750, "course_name": "DS", "color": "#FFFFFF"},
            {"week_day": 2, "start_time": 1020, "end_time": 1110, "course_name": "swpp", "color": "#000000"},
            {"week_day": 3, "start_time": 1110, "end_time": 1230, "course_name": "swpp", "color": "#000000"},
            {"week_day": 4, "start_time": 840, "end_time": 960, "course_name": "DS", "color": "#FFFFFF"},
        ]
        const component = mount(<TimeTableView courses={courses}/>);
        const datastructure=component.find('#timetable');
        expect(datastructure.length).toBe(1)
    });
});