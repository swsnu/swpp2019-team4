import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { mount } from 'enzyme';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../../test-utils/mocks';
import RecommendCourse from './RecommendCourse';

const stubState = {
  user: { is_authenticated: true, timetable_main: 0 },
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

describe('<RecommendCourse />', () => {
  beforeEach(() => {
  });

  afterEach(() => { jest.clearAllMocks(); });

  it('RecommendCourse render test', () => {
    const component = mount(window(stubState));
    expect(component.find('#rated-tab').length).toBe(1);
    expect(component.find('#unrated-tab').length).toBe(1);
    expect(component.find('#exception-tab').length).toBe(1);
    expect(component.find('#recommend-search-name').length).toBe(1);
    component.find('#recommend-search-name').at(0).simulate('change', { target: { value: 'swpp' } });
  });
});
