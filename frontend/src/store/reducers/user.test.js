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

  it('should call auto complete', () => {
    const newState = reducer(stubState, {
      type: actionTypes.AUTO_COMPLETE,
    });
    expect(newState.search_auto_complete).toBe(false);
  });

  it('should call search buildings and toggle auto when buildings length is 1', () => {
    const newState = reducer(stubState, {
      type: actionTypes.SEARCH_BUILDINGS,
      buildingList: [{}],
    });
    expect(newState.buildingList).toStrictEqual([{}]);
    expect(newState.search_auto_complete).toBe(true);
  });

  it('should call search buildings and not toggle auto when buildings length is not 1', () => {
    const newState = reducer(stubState, {
      type: actionTypes.SEARCH_BUILDINGS,
      buildingList: [{}, {}],
    });
    expect(newState.buildingList).toStrictEqual([{}, {}]);
    expect(newState.search_auto_complete).toBe(false);
  });

  it('should call set searchable', () => {
    const newState = reducer(stubState, {
      type: actionTypes.SET_SEARCHABLE,
    });
    expect(newState.searched).toBe(false);
  });

  it('should call set rated searchable', () => {
    const newState = reducer(stubState, {
      type: actionTypes.SET_RATED_SEARCHABLE,
    });
    expect(newState.ratedSearched).toBe(false);
  });

  it('should call set unrated searchable', () => {
    const newState = reducer(stubState, {
      type: actionTypes.SET_UNRATED_SEARCHABLE,
    });
    expect(newState.unratedSearched).toBe(false);
  });

  it('should call put coursepref temp and if coursepref exists then modify changed courses', () => {
    const stubState2 = {
      ...stubState,
      rated_course: [
        { id: 0, score: 3 },
        { id: 2, score: 7 },
      ],
      unrated_course: [
        { id: 0, score: 7 },
        { id: 3, score: 3 },
      ],
    };
    const newState = reducer(stubState2, {
      type: actionTypes.PUT_COURSEPREF_TEMP,
      coursepref: { id: 0, score: 5 },
    });
    expect(newState.rated_course).toStrictEqual([{ id: 0, score: 5 }, { id: 2, score: 7 }]);
    expect(newState.unrated_course).toStrictEqual([{ id: 0, score: 5 }, { id: 3, score: 3 }]);
  });

  it('should call set rated courses', () => {
    const newState = reducer(stubState, {
      type: actionTypes.SET_RATED_COURSE,
      course_list: [],
    });
    expect(newState.rated_course).toStrictEqual([]);
    expect(newState.ratedSearched).toBe(true);
  });

  it('should call set unrated courses', () => {
    const newState = reducer(stubState, {
      type: actionTypes.SET_UNRATED_COURSE,
      course_list: [],
    });
    expect(newState.unrated_course).toStrictEqual([]);
    expect(newState.unratedSearched).toBe(true);
  });

  it('should call get rated courses', () => {
    const stubState2 = { ...stubState, rated_course: [{ id: 0, score: 5 }] };
    const newState = reducer(stubState2, {
      type: actionTypes.GET_RATED_COURSE,
      course_list: [{ id: 1, score: 7 }],
    });
    expect(newState.rated_course).toStrictEqual([{ id: 0, score: 5 }, { id: 1, score: 7 }]);
  });

  it('should call get unrated courses', () => {
    const stubState2 = { ...stubState, unrated_course: [{ id: 0, score: 5 }] };
    const newState = reducer(stubState2, {
      type: actionTypes.GET_UNRATED_COURSE,
      course_list: [{ id: 1, score: 7 }],
    });
    expect(newState.unrated_course).toStrictEqual([{ id: 0, score: 5 }, { id: 1, score: 7 }]);
  });

  it('should call edit time preferences', () => {
    const newState = reducer(stubState, {
      type: actionTypes.EDIT_TIME_PREF,
      time_pref_table: [],
    });
    expect(newState.time_pref_table).toStrictEqual([]);
  });

  it('should call edit constraints', () => {
    const newState = reducer(stubState, {
      type: actionTypes.EDIT_CONSTRAINTS,
      constraints: [],
    });
    expect(newState.constraints).toStrictEqual([]);
  });

  it('should call get last page', () => {
    const newState = reducer(stubState, {
      type: actionTypes.GET_LAST_PAGE,
      lastPage: 2,
    });
    expect(newState.lastPage).toBe(2);
  });

  it('should call get recommend', () => {
    const newState = reducer(stubState, {
      type: actionTypes.GET_RECOMMEND,
      timetables: [],
    });
    expect(newState.recommended_timetables).toStrictEqual([]);
  });

  it('should call set courses', () => {
    const newState = reducer(stubState, {
      type: actionTypes.SET_COURSES,
      course_list: [],
    });
    expect(newState.courses).toStrictEqual([]);
    expect(newState.searched).toBe(true);
  });

  it('should call edit timetable', () => {
    const stubState2 = {
      ...stubState,
      timetables: [
        { id: 0, course: [{ name: '과기글' }, [{ name: '전전회' }]] },
        { id: 1, course: [{ name: '소개원실' }, [{ name: '인보프' }]] },
      ],
    };
    const newState = reducer(stubState2, {
      type: actionTypes.EDIT_TIMETABLE,
      timetable: { id: 1, course: [{ name: '소개원실' }] },
    });
    expect(newState.timetables).toStrictEqual([
      { id: 0, course: [{ name: '과기글' }, [{ name: '전전회' }]] },
      { id: 1, course: [{ name: '소개원실' }] },
    ]);
    expect(newState.timetable).toStrictEqual({ id: 1, course: [{ name: '소개원실' }] });
  });

  it('should call post course temp', () => {
    const stubState2 = {
      ...stubState,
      timetable: {
        id: 0,
        course: [{ id: 0, name: '과기글' }, { id: 1, name: '전전회' }],
      },
    };
    const newState = reducer(stubState2, {
      type: actionTypes.POST_COURSE_TEMP,
      course: { id: 2, name: '소개원실' },
    });
    expect(newState.timetable.course).toStrictEqual([
      { id: 0, name: '과기글' }, { id: 1, name: '전전회' }, { id: 2, name: '소개원실' },
    ]);
  });

  it('should call delete course temp', () => {
    const stubState2 = {
      ...stubState,
      timetable: {
        id: 0,
        course: [
          { id: 0, name: '과기글' },
          { id: 1, name: '전전회' },
          { id: 2, name: '소개원실', temp: true },
        ],
      },
    };
    const newState = reducer(stubState2, {
      type: actionTypes.DELETE_COURSE_TEMP,
      course: { id: 2, name: '소개원실' },
    });
    expect(newState.timetable.course).toStrictEqual([{ id: 0, name: '과기글' }, { id: 1, name: '전전회' }]);
  });
});
