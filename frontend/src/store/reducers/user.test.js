import reducer from './user';
import * as actionTypes from '../actions/actionTypes';

describe('Reducer', () => {
  let stubState;
  beforeEach(() => {
    stubState = {
      timetables: [],
      courses: [],
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
      timetable: {},
      timetable_friend: {},
      timetables: [],
      courses: [],
      friend: [],
      friend_send: [],
      friend_receive: [],
      search: {
        exist: false,
        status: '',
        username: '',
      },
    };
    const newState = reducer(initState, {});
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
  it('should get friend timetable', () => {
    const newState = reducer(stubState, {
      type: actionTypes.GET_TIMETABLE_FRIEND,
      timetable:
        {
          id: 1,
          title: 'my timetable',
          semester: '2019-2',
          user_id: 2,
        },
    });
    expect(newState.timetable_friend).toStrictEqual(
      {
        id: 1,
        title: 'my timetable',
        semester: '2019-2',
        user_id: 2,
      },
    );
  });
  it('should get timetable when post custom course', () => {
    const newState = reducer(stubState, {
      type: actionTypes.POST_CUSTOM_COURSE,
      timetable:
        {
          id: 1,
          title: 'my timetable',
          semester: '2019-2',
          user_id: 2,
        },
    });
    expect(newState.timetable).toStrictEqual(
      {
        id: 1,
        title: 'my timetable',
        semester: '2019-2',
        user_id: 2,
      },
    );
  });
  it('should get timetable', () => {
    const newState = reducer(stubState, {
      type: actionTypes.GET_TIMETABLE,
      timetable:
        {
          id: 1,
          title: 'my timetable',
          semester: '2019-2',
          user_id: 2,
        },
    });
    expect(newState.timetable).toStrictEqual(
      {
        id: 1,
        title: 'my timetable',
        semester: '2019-2',
        user_id: 2,
      },
    );
  });
  it('should get timetables', () => {
    const newState = reducer(stubState, {
      type: actionTypes.GET_TIMETABLES,
      timetables: [
        {
          id: 1,
          title: 'my timetable',
          semester: '2019-2',
          user_id: 2,
        }],
    });
    expect(newState.timetables).toStrictEqual(
      [{
        id: 1,
        title: 'my timetable',
        semester: '2019-2',
        user_id: 2,
      }],
    );
  });
  it('should post timetable', () => {
    const newState = reducer(stubState, {
      type: actionTypes.POST_TIMETABLE,
      timetable:
        {
          id: 1,
          title: 'my timetable',
          semester: '2019-2',
          user_id: 2,
        },
    });
    expect(newState.timetables.length).toBe(1);
  });
  it('should delete timetable', () => {
    stubState.timetables = [
      {
        id: 1,
        title: 'my timetable',
        semester: '2019-2',
        user_id: 2,
      }];
    expect(stubState.timetables.length).toBe(1);
    const newState = reducer(stubState, {
      type: actionTypes.DELETE_TIMETABLE,
      deletedTimetable: 1,
    });
    expect(newState.timetables.length).toBe(0);
  });
  it('should post course', () => {
    const newState = reducer(stubState, {
      type: actionTypes.POST_COURSE,
      timetable:
        {
          id: 1,
          title: 'my timetable',
          semester: '2019-2',
          user_id: 2,
        },
    });
    expect(newState.timetable).toStrictEqual(
      {
        id: 1,
        title: 'my timetable',
        semester: '2019-2',
        user_id: 2,
      },
    );
  });
  it('should delete course', () => {
    stubState.courses = [
      {
        id: 1,
        week_day: 0,
        start_time: 660,
        end_time: 750,
        name: '자료구조',
        color: '#2BC366',
        course_number: 'M1522.000900',
        lecture_number: '001',
      }];
    expect(stubState.courses.length).toBe(1);
    const newState = reducer(stubState, {
      type: actionTypes.DELETE_COURSE,
      courseId: 1,
    });
    expect(newState.courses.length).toBe(0);
  });

  it('should get courses', () => {
    const newState = reducer(stubState, {
      type: actionTypes.GET_COURSES,
      courses: [
        {
          week_day: 0,
          start_time: 660,
          end_time: 750,
          name: '자료구조',
          color: '#2BC366',
          course_number: 'M1522.000900',
          lecture_number: '001',
        }],
    });
    expect(newState.courses.length).toBe(1);
  });
  it('should post main timetable', () => {
    const newState = reducer(stubState, {
      type: actionTypes.POST_MAIN_TIMETABLE,
      timetable_main: {

        id: 1,
        title: 'my timetable',
        semester: '2019-2',
        user_id: 2,
      },
    });
    expect(newState.user.timetable_main).toStrictEqual({
      id: 1,
      title: 'my timetable',
      semester: '2019-2',
      user_id: 2,
    });
  });
});
