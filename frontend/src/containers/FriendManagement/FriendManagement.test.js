import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { mount } from 'enzyme';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';

import * as actionCreators from '../../store/actions/user';
import FriendManagement from './FriendManagement';

const stubState = {
  friend: [
    {
      id: 1,
      username: 'KHS',
      email: 'khsoo@gmail.com',
    },
  ],
  friend_receive: [
    {
      id: 2,
      username: 'KYC',
      email: 'vionic@gmail.com',
    },
  ],
  friend_send: [
    {
      id: 3,
      username: 'KJS',
      email: 'koo@gmail.com',
    },
    {
      id: 4,
      username: 'JJY',
      email: 'cubec@gmail.com',
    },
  ],
  search: {
    exist: false,
    status: '',
    username: '',
  },
};

function window(state) {
  const mockStore = getMockStore(state);
  return (
    <Provider store={mockStore}>
      <ConnectedRouter history={createBrowserHistory()}>
        <Switch>
          <Route path="/" exact render={() => <FriendManagement onClose={() => {}} />} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

describe('<FriendManagement />', () => {
  let spyGetFriend; let spyPostUserSearch; let spyReceiveFriend; let spyDeleteFriend; let spyCancelFriend; let
    spyRejectFriend;

  beforeEach(() => {
    spyGetFriend = jest.spyOn(actionCreators, 'getFriend')
      .mockImplementation(() => () => {});
    spyPostUserSearch = jest.spyOn(actionCreators, 'postUserSearch')
      .mockImplementation(() => () => Promise.resolve(null));
    spyReceiveFriend = jest.spyOn(actionCreators, 'receiveFriend')
      .mockImplementation(() => () => {});
    spyDeleteFriend = jest.spyOn(actionCreators, 'deleteFriend')
      .mockImplementation(() => () => {});
    spyCancelFriend = jest.spyOn(actionCreators, 'cancelFriend')
      .mockImplementation(() => () => {});
    spyRejectFriend = jest.spyOn(actionCreators, 'rejectFriend')
      .mockImplementation(() => () => {});
  });

  afterEach(() => { jest.clearAllMocks(); });

  it('Friend management page render test', () => {
    const component = mount(window(stubState));
    const emailInput = component.find('#email-input');
    const emailSearch = component.find('#email-search');
    const friendCancel = component.find('#friend-cancel');
    const friendReceive = component.find('#friend-receive');
    const friendReject = component.find('#friend-reject');
    const friendDelete = component.find('#friend-delete');
    expect(emailInput.length).toBe(1);
    expect(emailSearch.length).toBe(1);
    expect(friendCancel.length).toBe(2);
    expect(friendReceive.length).toBe(1);
    expect(friendReject.length).toBe(1);
    expect(friendDelete.length).toBe(1);
    expect(spyGetFriend).toHaveBeenCalledTimes(1);
  });

  it('User searching function should be called when click search button', () => {
    const component = mount(window(stubState));
    const emailSearch = component.find('#email-search');
    emailSearch.simulate('click');
    expect(spyPostUserSearch).toHaveBeenCalledTimes(1);
  });

  it('Friend canceling function should be called when click cancel button', () => {
    const component = mount(window(stubState));
    const friendCancel = component.find('#friend-cancel');
    friendCancel.at(0).simulate('click');
    expect(spyCancelFriend).toHaveBeenCalledTimes(1);
  });

  it('Friend receving function should be called when click receive button', () => {
    const component = mount(window(stubState));
    const friendReceive = component.find('#friend-receive');
    friendReceive.simulate('click');
    expect(spyReceiveFriend).toHaveBeenCalledTimes(1);
  });

  it('Friend rejecting function should be called when click reject button', () => {
    const component = mount(window(stubState));
    const friendReject = component.find('#friend-reject');
    friendReject.simulate('click');
    expect(spyRejectFriend).toHaveBeenCalledTimes(1);
  });

  it('Friend Deleting function should be called when click delete button', () => {
    const component = mount(window(stubState));
    const friendDelete = component.find('#friend-delete');
    friendDelete.simulate('click');
    expect(spyDeleteFriend).toHaveBeenCalledTimes(1);
  });

  it('Writing on email input should be change email value', () => {
    const email = 'assa.staff@gmail.com';
    const component = mount(window(stubState));
    const emailInput = component.find('#email-input');
    emailInput.simulate('change', { target: { value: email } });
    const instance = component.find(FriendManagement.WrappedComponent).instance();
    expect(instance.state.email).toEqual(email);
  });

  it('Should message when successful PENDING', async () => {
    const search = { exist: true, status: 'PENDING', username: 'cubec' };
    const component = mount(window({ ...stubState, search }));
    const emailSearch = component.find('#email-search');
    await emailSearch.simulate('click');
    const instance = component.find(FriendManagement.WrappedComponent).instance();
    expect(instance.state.message).not.toBe('');
  });

  it('Should message when successful FRIEND', async () => {
    const search = { exist: true, status: 'FRIEND', username: 'cubec' };
    const component = mount(window({ ...stubState, search }));
    const emailSearch = component.find('#email-search');
    await emailSearch.simulate('click');
    const instance = component.find(FriendManagement.WrappedComponent).instance();
    expect(instance.state.message).not.toBe('');
  });

  it('Should not message when successful without status', async () => {
    const search = { exist: true, status: '', username: 'cubec' };
    const component = mount(window({ ...stubState, search }));
    const emailSearch = component.find('#email-search');
    await emailSearch.simulate('click');
    const instance = component.find(FriendManagement.WrappedComponent).instance();
    expect(instance.state.message).toBe('');
  });


  it('Should message when unsuccessful FRIEND', async () => {
    const search = { exist: false, status: 'FRIEND', username: 'cubec' };
    const component = mount(window({ ...stubState, search }));
    const emailSearch = component.find('#email-search');
    await emailSearch.simulate('click');
    const instance = component.find(FriendManagement.WrappedComponent).instance();
    expect(instance.state.message).not.toBe('');
  });

  it('Should message when unsuccessful NULL', async () => {
    const search = { exist: false, status: 'NULL', username: 'cubec' };
    const component = mount(window({ ...stubState, search }));
    const emailSearch = component.find('#email-search');
    await emailSearch.simulate('click');
    const instance = component.find(FriendManagement.WrappedComponent).instance();
    expect(instance.state.message).not.toBe('');
  });

  it('Should message when unsuccessful SENT', async () => {
    const search = { exist: false, status: 'SENT', username: 'cubec' };
    const component = mount(window({ ...stubState, search }));
    const emailSearch = component.find('#email-search');
    await emailSearch.simulate('click');
    const instance = component.find(FriendManagement.WrappedComponent).instance();
    expect(instance.state.message).not.toBe('');
  });
});
