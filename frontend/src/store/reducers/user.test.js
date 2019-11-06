import reducer from './user';
import * as actionTypes from '../actions/actionTypes';

describe('Reducer', () => {
  let stubState;
  beforeEach(() => {
    stubState = {
      user: {
        is_authenticated: null,
      },
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
  });
  afterEach(() => { jest.clearAllMocks(); });
  it('should return default state', () => {
    const initState = {
      user: {
        is_authenticated: null,
      },
      friend: [],
      friend_send: [],
      friend_receive: [],
      timetable_data: [],
      search: {
        exist: false,
        status: '',
        username: '',
      },
    };
    const newState = reducer(undefined, {});
    expect(newState).toEqual(initState);
  });

  it('should get authentication', () => {
    const newState = reducer(stubState, {
      type: actionTypes.GET_AUTH,
      is_authenticated: true,
    });
    expect(newState.user.is_authenticated).toBe(true);
  });

  it('should get user', () => {
    const newState = reducer(stubState, {
      type: actionTypes.GET_USER,
      user: { email: 'cubec' },
    });
    expect(newState.user.email).toBe('cubec');
  });

  it('should get friends', () => {
    const newState = reducer(stubState, {
      type: actionTypes.GET_FRIEND,
      user: {
        friend: '1',
        friend_send: '2',
        friend_receive: '3',
      },
    });
    expect(newState.friend).toBe('1');
  });

  it('should make FRIEND from search', () => {
    const newState = reducer(stubState, {
      type: actionTypes.GET_USER_SEARCH,
      exist: true,
      status: 'FRIEND',
      user: {
        id: 2,
      },
    });
    expect(newState.friend.length).toBe(2);
    expect(newState.friend_receive.length).toBe(0);
  });

  it('should call friend request from search', () => {
    const newState = reducer(stubState, {
      type: actionTypes.GET_USER_SEARCH,
      exist: true,
      user: {
        id: 5,
      },
    });
    expect(newState.friend_send.length).toBe(3);
  });

  it('should save status when search fails', () => {
    const newState = reducer(stubState, {
      type: actionTypes.GET_USER_SEARCH,
      exist: false,
      status: 'NULL',
      user: {
        id: 5,
      },
    });
    expect(newState.search.status).toBe('NULL');
  });

  it('should save as a friend when receive succeeded', () => {
    const newState = reducer(stubState, {
      type: actionTypes.RECEIVE_FRIEND,
      user: {
        id: 2,
      },
    });
    expect(newState.friend.length).toBe(2);
  });

  it('should delete from a friend when delete succeeded', () => {
    const newState = reducer(stubState, {
      type: actionTypes.DELETE_FRIEND,
      user_id: 1,
    });
    expect(newState.friend.length).toBe(0);
  });

  it('should delete from a friend_send when cancel succeeded', () => {
    const newState = reducer(stubState, {
      type: actionTypes.CANCEL_FRIEND,
      user_id: 3,
    });
    expect(newState.friend_send.length).toBe(1);
  });

  it('should delete from a friend_receive when reject succeeded', () => {
    const newState = reducer(stubState, {
      type: actionTypes.REJECT_FRIEND,
      user_id: 2,
    });
    expect(newState.friend_receive.length).toBe(0);
  });
});
