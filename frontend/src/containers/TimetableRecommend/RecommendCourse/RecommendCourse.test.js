import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { mount } from 'enzyme';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../../test-utils/mocks';
import RecommendCourse from './RecommendCourse';
import * as actionCreators from '../../../store/actions/user';

const stubState = {
  user: { is_authenticated: true, timetable_main: 0 },
  rated_course: [{
    id: 0,
    score: 5,
    expected: 10,
    time: [
      { week_day: 0, start_time: 1020, end_time: 1110 },
      { week_day: 2, start_time: 1020, end_time: 1110 },
    ],
    professor: 'ABC',
    credit: 4,
    location: 'SNU',
  }],
  unrated_course: [{
    id: 1,
    score: 5,
    expected: 10,
    time: [
      { week_day: 0, start_time: 1020, end_time: 1110 },
      { week_day: 2, start_time: 1020, end_time: 1110 },
    ],
    professor: 'ABC',
    credit: 4,
    location: 'SNU',
  }],
  ratedSearched: false,
  unratedSearched: false,
};

const stubStateTrue = {
  user: { is_authenticated: true, timetable_main: 0 },
  rated_course: [],
  unrated_course: [{
    id: 0,
    score: 5,
    expected: 10,
    time: [
      { week_day: 0, start_time: 1020, end_time: 1110 },
      { week_day: 2, start_time: 1020, end_time: 1110 },
    ],
    professor: 'ABC',
    credit: 4,
    location: 'SNU',
  }],
  ratedSearched: true,
  unratedSearched: true,
};

function window(state) {
  const mockStore = getMockStore(state);
  return (
    <Provider store={mockStore}>
      <ConnectedRouter history={createBrowserHistory()}>
        <Switch>
          <Route path="/" exact component={() => <RecommendCourse handleValid={() => {}} />} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}
jest.mock('../../../components/SearchBar/SearchBar', () => jest.fn((props) => (
  <div className="SearchBar">
    <button id="toggle-button" onClick={() => props.onToggle()}>x</button>
    <button
      id="change-button"
      onClick={() => {
        props.onChange({ target: { value: 'A' } }, 'title');
        props.onChange({ target: { value: 'A' } }, 'classification');
        props.onChange({ target: { value: 'A' } }, 'department');
        props.onChange({ target: { value: 'A' } }, 'degree_program');
        props.onChange({ target: { value: 'A' } }, 'academic_year');
        props.onChange({ target: { value: 'A' } }, 'course_number');
        props.onChange({ target: { value: 'A' } }, 'lecture_number');
        props.onChange({ target: { value: 'A' } }, 'professor');
        props.onChange({ target: { value: 'A' } }, 'language');
        props.onChange({ target: { value: 0 } }, 'min_credit');
        props.onChange({ target: { value: 4 } }, 'max_credit');
        props.onChange({ target: { value: 0 } }, 'min_score');
        props.onChange({ target: { value: 10 } }, 'max_score');
      }}
    >
x
    </button>
    <button id="search-button" onClick={() => props.onSearch()}>x</button>
  </div>
)));
describe('<RecommendCourse />', () => {
  beforeEach(() => {
  });

  afterEach(() => { jest.clearAllMocks(); });

  it('RecommendCourse render test', () => {
    const spySetRated = jest.spyOn(actionCreators, 'setRatedCourse')
      .mockImplementation(() => () => Promise.resolve(null));
    const spySetUnrated = jest.spyOn(actionCreators, 'setUnratedCourse')
      .mockImplementation(() => () => Promise.resolve(null));
    const spyGetRated = jest.spyOn(actionCreators, 'getRatedCourse')
      .mockImplementation(() => () => Promise.resolve(null));
    const spyGetUnrated = jest.spyOn(actionCreators, 'getUnratedCourse')
      .mockImplementation(() => () => Promise.resolve(null));
    const spyPutCoursepref = jest.spyOn(actionCreators, 'putCoursepref')
      .mockImplementation(() => () => Promise.resolve(null));
    const component = mount(window(stubState));
    expect(component.find('#rated-tab-clicker').length).toBe(1);
    expect(spySetRated).toBeCalledTimes(1);
    expect(component.find('#unrated-tab-clicker').length).toBe(1);
    component.find('#unrated-tab-clicker').simulate('click');
    expect(spyPutCoursepref).toBeCalledTimes(1);
    expect(spySetUnrated).toBeCalledTimes(2);
    expect(component.find('.form-control-range').length).toBe(2);
    component.find('.form-control-range').at(1).simulate('change', { target: { value: 7 } });
    expect(component.find('.SearchBar').length).toBe(1);
    expect(component.find('#toggle-button').length).toBe(1);
    component.find('#toggle-button').simulate('click');
    expect(component.find('#change-button').length).toBe(1);
    component.find('#change-button').simulate('click');
    expect(component.find('#search-button').length).toBe(1);
    component.find('#search-button').simulate('click');
    component.find('#myTabContent').simulate('scroll', { target: { scrollTop: 3000 } });
    expect(spyGetUnrated).toBeCalledTimes(1);
    component.find('#rated-tab-clicker').simulate('click');
    component.find('#myTabContent').simulate('scroll', { target: { scrollTop: 3000 } });
    expect(spyGetRated).toBeCalledTimes(1);
  });
  it('RecommendCourse-true render test', () => {
    const spySetRated = jest.spyOn(actionCreators, 'setRatedCourse')
      .mockImplementation(() => () => Promise.resolve(null));
    const spySetUnrated = jest.spyOn(actionCreators, 'setUnratedCourse')
      .mockImplementation(() => () => Promise.resolve(null));
    const spyGetRated = jest.spyOn(actionCreators, 'getRatedCourse')
      .mockImplementation(() => () => Promise.resolve(null));
    const spyGetUnrated = jest.spyOn(actionCreators, 'getUnratedCourse')
      .mockImplementation(() => () => Promise.resolve(null));
    const spyPutCoursepref = jest.spyOn(actionCreators, 'putCoursepref')
      .mockImplementation(() => () => Promise.resolve(null));
    const component = mount(window(stubStateTrue));
    expect(component.find('#rated-tab-clicker').length).toBe(1);
    expect(spySetRated).toBeCalledTimes(1);
    expect(component.find('#unrated-tab-clicker').length).toBe(1);
    component.find('#unrated-tab-clicker').simulate('click');
    expect(spyPutCoursepref).toBeCalledTimes(1);
    expect(spySetUnrated).toBeCalledTimes(2);
    expect(component.find('.form-control-range').length).toBe(1);
    component.find('.form-control-range').simulate('change', { target: { value: 7 } });
    expect(component.find('.SearchBar').length).toBe(1);
    expect(component.find('#toggle-button').length).toBe(1);
    component.find('#toggle-button').simulate('click');
    expect(component.find('#change-button').length).toBe(1);
    component.find('#change-button').simulate('click');
    expect(component.find('#search-button').length).toBe(1);
    component.find('#search-button').simulate('click');
    component.find('#myTabContent').simulate('scroll', { target: { scrollTop: 3000 } });
    expect(spyGetUnrated).toBeCalledTimes(1);
    component.find('#rated-tab-clicker').simulate('click');
    component.find('#myTabContent').simulate('scroll', { target: { scrollTop: 3000 } });
    expect(spyGetRated).toBeCalledTimes(1);
  });
});
