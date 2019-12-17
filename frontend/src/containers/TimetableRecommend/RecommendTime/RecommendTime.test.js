import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { mount } from 'enzyme';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../../test-utils/mocks';
import RecommendTime from './RecommendTime';

const stubState = {
  user: { is_authenticated: true, timetable_main: 0 },
  time_pref_table: [
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3],
  ],
};

function window(state) {
  const mockStore = getMockStore(state);
  return (
    <Provider store={mockStore}>
      <ConnectedRouter history={createBrowserHistory()}>
        <Switch>
          <Route path="/" exact component={() => <RecommendTime handleValid={() => {}} />} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

describe('<RecommendTime />', () => {
  beforeEach(() => {
  });

  afterEach(() => { jest.clearAllMocks(); });

  it('RecommendTime render test', () => {
    const component = mount(window(stubState));
    expect(component.find('#recommend-time-table').length).toBe(1);
    expect(component.find('#table-square').length).toBe(156);
    component.find('#table-square').at(0).simulate('mouseDown', { preventDefault: () => true });
    component.find('#table-square').at(0).simulate('mouseUp', { preventDefault: () => true });
    component.find('#table-square').at(0).simulate('mouseEnter', { preventDefault: () => true });
    expect(component.find('#color-circle').length).toBe(4);
    component.find('#color-circle').at(0).simulate('click');
    component.find('#color-circle').at(0).simulate('keyDown', { keyCode: 13 });
  });
});
