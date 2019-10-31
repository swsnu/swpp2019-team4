import {mount} from 'enzyme';
import TimeTableView from './TimeTableView';
import React from 'react';
describe('<TimeTableView />', () => {
    it('TimeTableView render test', () => {
        var courses=[
            {"week_day": 0, "start_time": 660, "end_time": 750, "course_name": "DS", "color": "#2BC366"},
            {"week_day": 2, "start_time": 660, "end_time": 750, "course_name": "DS", "color": "#2BC366"},
            {"week_day": 4, "start_time": 840, "end_time": 960, "course_name": "DS", "color": "#2BC366"},
            {"week_day": 0, "start_time": 840, "end_time": 930, "course_name": "전기전자회로", "color": "#7FFF00"},
            {"week_day": 2, "start_time": 840, "end_time": 930, "course_name": "전기전자회로", "color": "#7FFF00"},
            {"week_day": 0, "start_time": 930, "end_time": 1020, "course_name": "컴퓨터구조", "color": "#FFD700"},
            {"week_day": 2, "start_time": 930, "end_time": 1020, "course_name": "컴퓨터구조", "color": "#FFD700"},
            {"week_day": 1, "start_time": 930, "end_time": 990, "course_name": "프로그래밍의원리", "color": "#664BC3"},
            {"week_day": 3, "start_time": 930, "end_time": 990, "course_name": "프로그래밍의원리", "color": "#664BC3"},
            {"week_day": 1, "start_time": 1110, "end_time": 1230, "course_name": "프로그래밍의원리", "color": "#664BC3"},
            {"week_day": 2, "start_time": 780, "end_time": 840, "course_name": "컴공세미나", "color": "#00C3F2"},
            {"week_day": 0, "start_time": 1020, "end_time": 1110, "course_name": "swpp", "color": "#FF2312"},
            {"week_day": 2, "start_time": 1020, "end_time": 1110, "course_name": "swpp", "color": "#FF2312"},
            {"week_day": 3, "start_time": 1110, "end_time": 1230, "course_name": "swpp", "color": "#FF2312"},
        ]
        const component = mount(<TimeTableView courses={courses}/>);
        const datastructure=component.find('#timetable');
        expect(datastructure.length).toBe(1)
    });
});