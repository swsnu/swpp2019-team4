import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actionCreators from '../../store/actions/index';
import TimetableView from '../../components/TimetableView/TimetableView';
import MainPageFriendListView from '../../components/MainPageFriendListView/MainPageFriendListView';
import TopBar from '../../components/TopBar/TopBar';
import FriendManagement from '../FriendManagement/FriendManagement';
import './Main.css';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFriendManagement: false,
    };
  }

  componentDidMount() {
    this.props.onGetUser();
  }

  handleLogout() {
    this.props.onLogout();
  }

  toggleFriendManagement() {
    this.setState((prevState) => ({
      showFriendManagement: !prevState.showFriendManagement,
    }));
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
        <div className="Content-left">
          <TimetableView id="timetable-table" height={24} width={80} courses={courses} />
        </div>
        <div className="Content-right">
          <button type="button" id="friend-request" onClick={() => this.toggleFriendManagement()}>MANAGE FRIENDS</button>
          <MainPageFriendListView id="friend-list" friends={friend} />
        </div>
        {this.state.showFriendManagement
          ? <FriendManagement onClose={() => this.toggleFriendManagement()} />
          : null}
      </div>
    );
  }
}

Main.propTypes = {
  onGetUser: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  storedUser: PropTypes.shape({
    is_authenticated: PropTypes.bool.isRequired,
  }).isRequired,
};
const mapStateToProps = (state) => ({
  storedUser: state.user.user,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onLogout: () => dispatch(actionCreators.getSignout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
