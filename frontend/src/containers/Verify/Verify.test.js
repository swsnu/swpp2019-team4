import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { mount } from 'enzyme';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';
import Verify from './Verify';

const stubStateTrue = {
  user: { is_authenticated: true },
};

function verify(state) {
  const mockStore = getMockStore(state);
  const history = createBrowserHistory();
  return (
    <Provider store={mockStore}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route
            path="/"
            exact
            render={() => (
              <Verify
                history={history}
                match={{ params: { uid: '', token: '' } }}
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

  it('should redirect to /main when logged_in is true', () => {
    const component = mount(verify(stubStateTrue));
    expect(component.find('.Main').length).toBe(1);
  });
});
