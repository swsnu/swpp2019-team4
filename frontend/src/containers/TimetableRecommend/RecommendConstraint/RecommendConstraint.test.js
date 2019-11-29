import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { mount } from 'enzyme';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../../test-utils/mocks';
import RecommendConstraint from './RecommendConstraint';

const stubState = {
  user: { is_authenticated: true, timetable_main: 0 },
};

function window(state) {
  const mockStore = getMockStore(state);
  return (
    <Provider store={mockStore}>
      <ConnectedRouter history={createBrowserHistory()}>
        <Switch>
          <Route path="/" exact component={() => <RecommendConstraint handleValid={() => {}} />} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

describe('<RecommendConstraint />', () => {
  beforeEach(() => {
  });

  afterEach(() => { jest.clearAllMocks(); });

  it('RecommendConstraint render test', () => {
    const component = mount(window(stubState));
    expect(component.find('#days-range-input').length).toBe(1);
    component.find('#days-range-input').at(0).simulate('change', { target: { value: 4 } });
    expect(component.find('#credit-min-input').length).toBe(1);
    component.find('#credit-min-input').at(0).simulate('change', { target: { value: 1 } });
    expect(component.find('#credit-max-input').length).toBe(1);
    component.find('#credit-max-input').at(0).simulate('change', { target: { value: 18 } });
  });
});
