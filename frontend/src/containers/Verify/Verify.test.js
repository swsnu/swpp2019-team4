import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
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

function verify(state, redir) {
  const mockStore = getMockStore(state);
  const history = createBrowserHistory();
  return (
    <Provider store={mockStore}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/:uid/:token" exact component={Verify} />
          <Route path="/login" exact render={() => <div className="Login" />} />
          <Route path="/main" exact render={() => <div className="Main" />} />
          <Redirect from="/" to={redir} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

describe('verification test', () => {
  beforeEach(() => {
  });

  afterEach(() => jest.clearAllMocks());

  it('should redirect to /main when logged_in is true', () => {
    const component = mount(verify(stubStateTrue, '/1/1'));
    expect(component.find('.Main').length).toBe(1);
  });

  it('should redirect to /login when to-login-button is clicked', () => {
    const component = mount(verify(stubState, '/1/1'));
    component.find('#to-login-button').simulate('click');
    expect(component.find('.Login').length).toBe(1);
  });
});
