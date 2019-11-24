import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';
import CustomCourse from './CustomCourse';

import * as actionCreators from '../../store/actions/user';

const custom = {
    title: '',
    time: '',
    color: '',
};

function window(course) {
  const mockStore = getMockStore(course);
  let postCustom;
  let onPostCustomCourse = (timetableId, courseInfo, courseTime) => 
    {actionCreators.postCustomCourse(timetableId, courseInfo, courseTime)}
  
  postCustom = (courseData, courseTime) => {
    const courseTimes = courseTime.split('/');
    const splitedCourseTime = [];
    for (let i = 0; i < courseTimes.length; i += 1) {
      splitedCourseTime.push(courseTimes[i].split('-'));
    }
    onPostCustomCourse(0, courseData, splitedCourseTime);
  }
  return (
    <Provider store={mockStore}>
      <ConnectedRouter history={createBrowserHistory()}>
        <Switch>
          <Route path="/" 
          exact render={() => <CustomCourse 
                                closePopup={() => {}}
                                postCustomCourse={(courseData, courseTime) => postCustom(courseData, courseTime)} />} 
                            />
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

describe('<CustomCourse />', () => {
  let spyPostCustomCourse;

  beforeEach(() => {
    spyPostCustomCourse = jest.spyOn(actionCreators, 'postCustomCourse')
    .mockImplementation(() => () => {});
  })

  it('CustomCourse render test', () => {
    const component = mount(window(custom));
    const CustomCourse = component.find('.dim-layer');
    expect(CustomCourse.length).toBe(1);
  });

  it('should call postCustomCourse when clicked post-button', () => {
    const component = mount(window(custom));
    component.find('.post-button').simulate('click');
    expect(spyPostCustomCourse).toBeCalledTimes(1);
  })
});
