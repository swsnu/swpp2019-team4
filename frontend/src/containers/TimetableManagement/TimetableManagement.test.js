import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { mount } from 'enzyme';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';
import TimetableManagement from './TimetableManagement';

import * as actionCreators from '../../store/actions/user';

const stubState = {
  user: { is_authenticated: true },
};

const stubStateFalse = {
  user: { is_authenticated: false },
};
function timetableManagement(state) {
  const mockStore = getMockStore(state);
  return (
    <Provider store={mockStore}>
      <ConnectedRouter history={createBrowserHistory()}>
        <Switch>
          <Route path="/" exact render={() => <TimetableManagement courses={[]} height={24} width={80} />} />
          <Route path="/login" exact render={() => <div className="Login" />} />
          <Route path="/main" exact render={() => <div className="Main" />} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

describe('verification test', () => {
  let spyGetSignout;
  beforeEach(() => {
    spyGetSignout = jest.spyOn(actionCreators, 'getSignout')
      .mockImplementation(() => () => {});
  });

  afterEach(() => jest.clearAllMocks());

  it('should render timetableManagement', () => {
    const component = mount(timetableManagement(stubState));
    expect(component.find('#topbar').length).toBe(1);
    expect(component.find('#logout-button').length).toBe(1);
    expect(component.find('#semester-select').length).toBe(1);
    expect(component.find('#courses').length).toBe(1);
    expect(component.find('#timetable-table').length).toBe(1);
    expect(component.find('#delete-button').length).toBe(1);
    expect(component.find('#create-button').length).toBe(1);
    expect(component.find('#timetable-recommend-button').length).toBe(1);
  });

  it('should call signout when pressed logout button', () => {
    const component = mount(timetableManagement(stubState));
    component.find('#logout-button').simulate('click');
    expect(spyGetSignout).toBeCalledTimes(1);
  });

  it('should redirect to login when is_authenticated is false', () => {
    const component = mount(timetableManagement(stubStateFalse));
    expect(component.find('.Login').length).toBe(1);
  });
});
