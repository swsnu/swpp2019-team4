import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';
import * as actionCreators from '../../store/actions/user';
import Account from './Account';

const stubState = {
  user: {
    is_authenticated: true,
    username: 'vionicbest',
    grade: 2,
    department: '컴퓨터공학부',
  },
};

const stubStateFalse = {
  user: {
    is_authenticated: false,
  },
};

function window(state) {
  const mockStore = getMockStore(state);
  return (
    <Provider store={mockStore}>
      <ConnectedRouter history={createBrowserHistory()}>
        <Switch>
          <Route path="/" exact component={Account} />
          <Route path="/login" exact render={() => <div className="Login" />} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

jest.mock('../../components/TopBar/TopBar', () => jest.fn((props) => (
  <div className="TopBar">
    <button type="button" className="text-black-50" id="logout-button" onClick={() => props.logout()}>
      x
    </button>
  </div>
)));

describe('<Account />', () => {
  let spyGetSignout;
  let spyPutUser;

  beforeEach(() => {
    spyGetSignout = jest.spyOn(actionCreators, 'getSignout')
      .mockImplementation(() => () => {});
    spyPutUser = jest.spyOn(actionCreators, 'putUser');
  });

  afterEach(() => jest.clearAllMocks());

  it('Account render test', () => {
    const component = mount(window(stubState));
    const account = component.find('.Account');
    expect(account.length).toBe(1);
  });

  it('Should not show page when the user is not authenticated', () => {
    const component = mount(window(stubStateFalse));
    const account = component.find('.Account');
    expect(account.length).toBe(0);
  });

  it('should call signout when pressed logout button', () => {
    const component = mount(window(stubState));
    component.find('#logout-button').simulate('click');
    expect(spyGetSignout).toBeCalledTimes(1);
  });

  it('should not call putUser with unvalid input', () => {
    const component = mount(window(stubState));
    component.find('#confirm-signup-button').simulate('click');
    expect(spyPutUser).toBeCalledTimes(0);
  });

  it('should call putUser with valid input', () => {
    const component = mount(window(stubState));
    component.find('#username-input').simulate('change', { target: { value: '김영찬' } });
    component.find('#department-input').simulate('change', { target: { value: '컴퓨터공학부' } });
    component.find('#grade-input').simulate('change', { target: { value: '2018' } });
    component.find('#password-prev-input').simulate('change', { target: { value: '12345678' } });
    component.find('#password-input').simulate('change', { target: { value: '123456789' } });
    component.find('#password-confirm-input').simulate('change', { target: { value: '123456789' } });
    component.find('#confirm-signup-button').simulate('click');
    expect(spyPutUser).toBeCalledTimes(1);
  });
});
