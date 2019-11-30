import { mount } from 'enzyme';
import React from 'react';
import { moment } from 'react-datetime';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';
import CustomCourse from './CustomCourse';

import * as actionCreators from '../../store/actions/user';

const stubState = {
  id: 1,
};

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

  it('should append time and delete time', () => {
    const component = mount(window(stubState));
    component.find('#append-time-button').simulate('click');
    const ctrl = component.find('#weekday-control');
    expect(component.find('CustomCourse').instance().state).toStrictEqual(
      { color: '#f47373', time: [{ end_time: '13:00', start_time: '12:00', week_day: 0 }], title: '' },
    );
    ctrl.simulate('change', { target: { value: '4' } });
    expect(component.find('CustomCourse').instance().state).toStrictEqual(
      { color: '#f47373', time: [{ end_time: '13:00', start_time: '12:00', week_day: '4' }], title: '' },
    );
    const ctrl2 = component.find('[className="col pr-0"]');
    ctrl2.prop('onChange')(moment('2019-11-30 11:00'));
    const ctrl3 = component.find('[className="col px-0"]');
    ctrl3.prop('onChange')(moment('2019-11-30 15:00'));
    expect(component.find('CustomCourse').instance().state).toStrictEqual(
      { color: '#f47373', time: [{ end_time: '15:00', start_time: '11:00', week_day: '4' }], title: '' },
    );
    component.find('#delete-time-button').simulate('click');
    expect(component.find('CustomCourse').instance().state).toStrictEqual(
      { color: '#f47373', time: [], title: '' },
    );
  });
});
