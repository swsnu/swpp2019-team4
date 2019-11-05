import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { mount } from 'enzyme';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';
import TimetableRecommend from './TimetableRecommend';
import TimetableGenerator from '../../components/TimetableGenerator/TimetableGenerator';

const stubState = {
  user: { is_authenticated: true },
};

function timetableManagement(state) {
  const mockStore = getMockStore(state);
  const recommendlist = [TimetableGenerator(0)];
  return (
    <Provider store={mockStore}>
      <ConnectedRouter history={createBrowserHistory()}>
        <Switch>
          <Route
            path="/"
            exact
            render={() => (
              <TimetableRecommend
                timetable={recommendlist}
                closePopup={() => 1}
              />
            )}
          />
          <Route path="/login" exact render={() => <div className="Login" />} />
          <Route path="/main" exact render={() => <div className="Main" />} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

describe('verification test', () => {
  beforeEach(() => {

  });

  afterEach(() => jest.clearAllMocks());

  it('should render timetableRecommend', () => {
    const component = mount(timetableManagement(stubState));
    expect(component.find('#timetable-table').length).toBe(2);
    expect(component.find('#save-button').length).toBe(1);
    expect(component.find('#close-button').length).toBe(1);
    expect(component.find('.timetable').length).toBe(1);
    component.find('.timetable').simulate('click');
    component.find('.timetable').simulate('keydown');
  });
});
