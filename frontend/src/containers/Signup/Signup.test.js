import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { mount } from 'enzyme';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';
import Signup from './Signup';

import * as actionCreators from '../../store/actions/user';

const stubState = {
  user: { is_authenticated: false },
  email_sending: false,
};

const stubStateTrue = {
  user: { is_authenticated: true },
  email_sending: false,
};

function signup(state) {
  const mockStore = getMockStore(state);
  return (
    <Provider store={mockStore}>
      <ConnectedRouter history={createBrowserHistory()}>
        <Switch>
          <Route path="/" exact component={Signup} />
          <Route path="/login" exact render={() => <div className="Login" />} />
          <Route path="/main" exact render={() => <div className="Main" />} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

describe('verification test', () => {
  let spyPostSignup;

  beforeEach(() => {
    spyPostSignup = jest.spyOn(actionCreators, 'postSignup')
      .mockImplementation(() => () => Promise.resolve(null));
  });

  afterEach(() => jest.clearAllMocks());

  it('should render signup', () => {
    const component = mount(signup(stubState));
    expect(component.find('.Signup').length).toBe(1);
  });

  it('should redirect to /main when logged_in is true', () => {
    const component = mount(signup(stubStateTrue));
    expect(component.find('.Main').length).toBe(1);
  });

  it('should redirect to /login when to-login-button is clicked', () => {
    const component = mount(signup(stubState));
    component.find('#to-login-button').simulate('click');
    expect(component.find('.Login').length).toBe(1);
  });

  it('confirm-signup-button should be disable when the information is wrong', () => {
    const component = mount(signup(stubState));
    component.find('#department-input').simulate('change', { target: { value: '바비든든' } });
    component.find('#grade-input').simulate('change', { target: { value: '1234' } });
    expect(component.find('#confirm-signup-button').props().disabled).toBe(true);
  });

  it('postSignup should be called when signup process is successfully done', () => {
    const component = mount(signup(stubState));
    component.find('#email-input').simulate('change', { target: { value: 'anonimous@asdf.com' } });
    component.find('#password-input').simulate('change', { target: { value: '54325432' } });
    component.find('#password-confirm-input').simulate('change', { target: { value: '54325432' } });
    component.find('#username-input').simulate('change', { target: { value: '소개원실' } });
    component.find('#department-input').simulate('change', { target: { value: '컴퓨터공학부' } });
    component.find('#grade-input').simulate('change', { target: { value: '1' } });
    component.find('#confirm-signup-button').simulate('click');
    expect(spyPostSignup).toHaveBeenCalledTimes(1);
  });
});
