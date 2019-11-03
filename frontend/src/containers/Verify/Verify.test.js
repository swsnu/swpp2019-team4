import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { mount } from 'enzyme';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';
import Verify from './Verify';

const stubState = {
  user: { is_authenticated: false },
};

const stubStateTrue = {
  user: { is_authenticated: true },
};

function verify(stubState) {
  const mockStore = getMockStore(stubState);
  return (
    <Provider store={mockStore}>
      <ConnectedRouter history={createBrowserHistory()}>
        <Switch>
          <Route path="/" exact component={Verify} />
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

  it('should redirect to /login when logged_in is false', () => {
    const component = mount(verify(stubState));
    expect(component.find('.Login').length).toBe(1);
  });

  it('should redirect to /main when logged_in is true', () => {
    const component = mount(verify(stubStateTrue));
    expect(component.find('.Main').length).toBe(1);
  });
});
