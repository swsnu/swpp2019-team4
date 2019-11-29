import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';
import CustomCourse from './CustomCourse';

import * as actionCreators from '../../store/actions/user';

const stubState = {};

function window(state) {
  const mockStore = getMockStore(state);
  return (
    <Provider store={mockStore}>
      <ConnectedRouter history={createBrowserHistory()}>
        <Switch>
          <Route path="/" exact component={CustomCourse} />
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
  });

  it('CustomCourse render test', () => {
    const component = mount(window(stubState));
    const customCourse = component.find('.CustomCourse');
    expect(customCourse.length).toBe(1);
  });

  it('should call postCustomCourse when clicked post-button', () => {
    const component = mount(window(stubState));
    component.find('.post-button').simulate('click');
    expect(spyPostCustomCourse).toBeCalledTimes(1);
  });
});
