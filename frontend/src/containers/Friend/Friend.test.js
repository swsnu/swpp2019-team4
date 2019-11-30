import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { mount } from 'enzyme';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { getMockStore } from '../../test-utils/mocks';
import Friend from './Friend';

import * as actionCreators from '../../store/actions/user';

const stubState = {
  user: { is_authenticated: true },
  search: {
    exist: false,
    status: '',
    username: '',
  },
  friend: [
    {
      id: 1,
      name: '정재윤',
      email: 'cubec@gmail.com',
      timetable_main: {
        course: [{
          title: '소개원실 (테스트용)',
          time: [{
            week_day: 3,
            start_time: 1110,
            end_time: 1170,
          }],
          course_number: 'M1522.002400',
          lecture_number: '001',
          color: '#FF0000',
        }],
      },
    },
    {
      id: 2,
      name: '구준서',
      email: 'ookoo@gmail.com',
      timetable_main: {
        course: [{
          title: '소개원실 (테스트용)',
          time: [{
            week_day: 3,
            start_time: 1110,
            end_time: 1170,
          }],
          course_number: 'M1522.002400',
          lecture_number: '001',
          color: '#FF0000',
        }],
      },
    },
  ],
  friend_send: [
    {
      id: 3,
      name: '김영찬',
      email: 'paden@gmail.com',
    }],
  friend_receive: [
    {
      id: 4,
      name: '김현수',
      email: 'khsoo@gmail.com',
    }],
};

const stubStateFalse = {
  user: { is_authenticated: false, timetable_main: 0 },
  friend: [],
  friend_receive: [],
  friend_send: [],
  search: {
    exist: false,
    status: '',
    username: '',
  },
};

function window(state, location = { hash: '' }) {
  const mockStore = getMockStore(state);
  return (
    <Provider store={mockStore}>
      <ConnectedRouter history={createBrowserHistory()}>
        <Switch>
          <Route path="/" exact render={() => <Friend location={location} />} />
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

jest.mock('../../components/TimetableView/TimetableView', () => jest.fn((props) => (
  <div className="TimetableView">
    {props.courses.map((x) => <button id="fake-course" type="button" key={1}>{x.course_id}</button>)}
  </div>
)));

describe('<Friend />', () => {
  let spyPostUserSearch; let spyReceiveFriend; let spyDeleteFriend; let spyCancelFriend; let
    spyRejectFriend;
  let spyGetSignout;

  beforeEach(() => {
    spyPostUserSearch = jest.spyOn(actionCreators, 'postUserSearch')
      .mockImplementation(() => () => Promise.resolve(null));
    spyReceiveFriend = jest.spyOn(actionCreators, 'receiveFriend')
      .mockImplementation(() => () => {});
    spyDeleteFriend = jest.spyOn(actionCreators, 'deleteFriend')
      .mockImplementation(() => () => Promise.resolve(null));
    spyCancelFriend = jest.spyOn(actionCreators, 'cancelFriend')
      .mockImplementation(() => () => {});
    spyRejectFriend = jest.spyOn(actionCreators, 'rejectFriend')
      .mockImplementation(() => () => {});
    spyGetSignout = jest.spyOn(actionCreators, 'getSignout')
      .mockImplementation(() => () => {});
  });

  afterEach(() => { jest.clearAllMocks(); });

  it('Friend page render test', () => {
    const component = mount(window(stubState));
    const topbar = component.find('.TopBar');
    const timetable = component.find('.TimetableView');
    expect(topbar.length).toBe(1);
    expect(timetable.length).toBe(1);
  });

  it('should call signout when pressed logout button', () => {
    const component = mount(window(stubState));
    component.find('#logout-button').simulate('click');
    expect(spyGetSignout).toBeCalledTimes(1);
  });

  it('should redirect to login when is_authenticated is false', () => {
    const component = mount(window(stubStateFalse));
    expect(component.find('.Login').length).toBe(1);
  });

  it('User searching function should be called when click search button', () => {
    const component = mount(window(stubState));
    const emailSearch = component.find('#email-search');
    emailSearch.simulate('click');
    expect(spyPostUserSearch).toHaveBeenCalledTimes(1);
  });

  it('User searching function should be called when pressed the enter key', () => {
    const component = mount(window(stubState));
    const emailSearch = component.find('#email-input');
    emailSearch.simulate('keyDown', { keyCode: 13 });
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
    const friendDelete = component.find('#friend-delete').at(0);
    friendDelete.simulate('click');
    expect(spyDeleteFriend).toHaveBeenCalledTimes(1);
  });

  it('Writing on email input should be change email value', () => {
    const email = 'assa.staff@gmail.com';
    const component = mount(window(stubState));
    const emailInput = component.find('#email-input');
    emailInput.simulate('change', { target: { value: email } });
    const instance = component.find(Friend.WrappedComponent).instance();
    expect(instance.state.email).toEqual(email);
  });

  it('Should message when successful PENDING', async () => {
    const search = { exist: true, status: 'PENDING', username: 'cubec' };
    const component = mount(window({ ...stubState, search }));
    const emailSearch = component.find('#email-search');
    await emailSearch.simulate('click');
    const instance = component.find(Friend.WrappedComponent).instance();
    expect(instance.state.message).not.toBe('');
  });

  it('Should message when successful FRIEND', async () => {
    const search = { exist: true, status: 'FRIEND', username: 'cubec' };
    const component = mount(window({ ...stubState, search }));
    const emailSearch = component.find('#email-search');
    await emailSearch.simulate('click');
    const instance = component.find(Friend.WrappedComponent).instance();
    expect(instance.state.message).not.toBe('');
  });

  it('Should not message when successful without status', async () => {
    const search = { exist: true, status: '', username: 'cubec' };
    const component = mount(window({ ...stubState, search }));
    const emailSearch = component.find('#email-search');
    await emailSearch.simulate('click');
    const instance = component.find(Friend.WrappedComponent).instance();
    expect(instance.state.message).toBe('');
  });


  it('Should message when unsuccessful FRIEND', async () => {
    const search = { exist: false, status: 'FRIEND', username: 'cubec' };
    const component = mount(window({ ...stubState, search }));
    const emailSearch = component.find('#email-search');
    await emailSearch.simulate('click');
    const instance = component.find(Friend.WrappedComponent).instance();
    expect(instance.state.message).not.toBe('');
  });

  it('Should message when unsuccessful NULL', async () => {
    const search = { exist: false, status: 'NULL', username: 'cubec' };
    const component = mount(window({ ...stubState, search }));
    const emailSearch = component.find('#email-search');
    await emailSearch.simulate('click');
    const instance = component.find(Friend.WrappedComponent).instance();
    expect(instance.state.message).not.toBe('');
  });

  it('Should message when unsuccessful SENT', async () => {
    const search = { exist: false, status: 'SENT', username: 'cubec' };
    const component = mount(window({ ...stubState, search }));
    const emailSearch = component.find('#email-search');
    await emailSearch.simulate('click');
    const instance = component.find(Friend.WrappedComponent).instance();
    expect(instance.state.message).not.toBe('');
  });

  it('Should show timetable of friend id when linked to #(number)', async () => {
    const component = mount(window(stubState, { hash: '#1' }));
    expect(component.find('#fake-course').length).toBe(1);
  });

  it('Should show timetable of friend id when clicked show button', async () => {
    const component = mount(window(stubState));
    const friendView = component.find('#friend-view').at(0);
    friendView.simulate('click');
    expect(component.find('#fake-course').length).toBe(1);
    friendView.simulate('click');
    expect(component.find('#fake-course').length).toBe(0);
  });

  /*
  it('Should remove timetable of friend id when delete friend', async () => {
    const component = mount(window(stubState, {hash: '#1'}));
    expect(component.find('#fake-course').length).toBe(1);
    const friendDelete = component.find('#friend-delete').at(0);
    await friendDelete.simulate('click');
    expect(component.find('#fake-course').length).toBe(0);
  });
  */
});
