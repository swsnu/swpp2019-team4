import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actionCreators from '../../store/actions/index';
import TimeTableView from '../../components/TimeTableView/TimeTableView';
import MainPageFriendListView from '../../components/MainPageFriendListView/MainPageFriendListView';
import TopBar from '../../components/TopBar/TopBar';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.onGetUser();
  }

  handleLogout() {
    this.props.onLogout();
  }

  render() {
    if (this.props.storedUser.is_authenticated === false) {
      return (
        <Redirect to="/login" />
      );
    }
    const friend = [
      {
        id: 1, name: '정재윤', inclass: false, timeleft: '2147483647',
      },
      {
        id: 2, name: '구준서', inclass: false, timeleft: '2147483647',
      },
      {
        id: 3, name: '김영찬', inclass: true, timeleft: '2147483647',
      },
      {
        id: 4, name: '김현수', inclass: false, timeleft: '2147483647',
      },
    ];
    const courses = [
      {
        week_day: 0, start_time: 660, end_time: 750, course_name: '자료구조', color: '#2BC366',
      },
      {
        week_day: 2, start_time: 660, end_time: 750, course_name: '자료구조', color: '#2BC366',
      },
      {
        week_day: 4, start_time: 840, end_time: 960, course_name: '자료구조', color: '#2BC366',
      },
      {
        week_day: 0, start_time: 840, end_time: 930, course_name: '전기전자회로', color: '#7FFF00',
      },
      {
        week_day: 2, start_time: 840, end_time: 930, course_name: '전기전자회로', color: '#7FFF00',
      },
      {
        week_day: 0, start_time: 930, end_time: 1020, course_name: '컴퓨터구조', color: '#FFD700',
      },
      {
        week_day: 2, start_time: 930, end_time: 1020, course_name: '컴퓨터구조', color: '#FFD700',
      },
      {
        week_day: 1, start_time: 930, end_time: 990, course_name: '프로그래밍의원리', color: '#664BC3',
      },
      {
        week_day: 3, start_time: 930, end_time: 990, course_name: '프로그래밍의원리', color: '#664BC3',
      },
      {
        week_day: 1, start_time: 1110, end_time: 1230, course_name: '프로그래밍의원리', color: '#664BC3',
      },
      {
        week_day: 2, start_time: 780, end_time: 840, course_name: '컴공세미나', color: '#00C3F2',
      },
      {
        week_day: 0, start_time: 1020, end_time: 1110, course_name: '소프트웨어 개발의 원리와 실습', color: '#FF2312',
      },
      {
        week_day: 2, start_time: 1020, end_time: 1110, course_name: '소프트웨어 개발의 원리와 실습', color: '#FF2312',
      },
      {
        week_day: 3, start_time: 1110, end_time: 1230, course_name: '소프트웨어 개발의 원리와 실습', color: '#FF2312',
      },
    ];
    return (
      <div className="Main">
        <TopBar id="topbar" />
        <button type="button" id="logout-button" onClick={() => this.handleLogout()}>LOGOUT</button>
        <br />
        <TimeTableView id="timetable-table" courses={courses} />
        <MainPageFriendListView id="friend-list" friends={friend} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  storedUser: state.user.user,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onLogout: () => dispatch(actionCreators.getSignout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
