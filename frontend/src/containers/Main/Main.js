import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actionCreators from '../../store/actions/index';
import TimetableView from '../../components/TimetableView/TimetableView';
import MainPageFriendView from '../../components/MainPageFriendView/MainPageFriendView';
import TopBar from '../../components/TopBar/TopBar';
import FriendManagement from '../FriendManagement/FriendManagement';
import FriendTimetable from '../../components/FriendTimetable/FriendTimetable';
import './Main.css';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFriendManagement: false,
      showPopup: false,
      showindex: -1,
    };
  }

  componentDidMount() {
    this.props.onGetUser();
    this.props.onGetTimetableData();
  }

  handleLogout() {
    this.props.onLogout();
  }

  toggleFriendManagement() {
    this.setState((prevState) => ({
      ...prevState,
      showFriendManagement: !prevState.showFriendManagement,
    }));
  }

  changePopup(value) {
    if (value === -1) {
      this.setState((prevState) => ({
        ...prevState,
        showPopup: false,
        showindex: -1,
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        showPopup: true,
        showindex: value,
      }));
    }
  }

  render() {
    if (this.props.storedUser.is_authenticated === false) {
      return (
        <Redirect to="/login" />
      );
    }
    const friend = [
      {
        id: 0,
        name: '정재윤',
        timetable: [
          {
            title: '소개원실 (테스트용)',
            week_day: 3,
            start_time: 1110,
            end_time: 1170,
            course_number: 'M1522.002400',
            lecture_number: '001',
            color: '#FF0000',
          },
        ],
      },
      {
        id: 1,
        name: '구준서',
        timetable: [
          {
            title: '소개원실 (테스트용)',
            week_day: 3,
            start_time: 1020,
            end_time: 1110,
            course_number: 'M1522.002400',
            lecture_number: '001',
            color: '#FF0000',
          },
        ],
      },
      {
        id: 2,
        name: '김영찬',
        timetable: [
          {
            title: '소개원실 (테스트용)',
            week_day: 3,
            start_time: 1170,
            end_time: 1230,
            course_number: 'M1522.002400',
            lecture_number: '001',
            color: '#FF0000',
          },
        ],
      },
      {
        id: 3,
        name: '김현수',
        timetable: [
          {
            title: '소개원실 (테스트용)',
            week_day: 4,
            start_time: 480,
            end_time: 1440,
            course_number: 'M1522.002400',
            lecture_number: '001',
            color: '#FF0000',
          },
        ],
      },
    ];

    let courses = [];
    if (this.props.timetable_list !== undefined && this.props.storedUser.timetable_main !== undefined) {
      const filtered = this.props.timetable_list.filter(
        (x) => x.length !== 0 && x[0].timetable_id === this.props.storedUser.timetable_main,
      );
      if (filtered.length !== 0) {
        [courses] = filtered;
      }
    }

    const friendListView = friend.map((user) => (
      <MainPageFriendView friend={user} onClick={() => this.changePopup(user.id)} key={user.id} />
    ));
    return (
      <div className="Main">
        <TopBar id="topbar" logout={() => this.handleLogout()} />
        <br />
        <div className="Content-left">
          <TimetableView id="timetable-table" height={24} width={80} courses={courses} text link title="TIMETABLE" />
        </div>
        <div className="Content-right">
          <button type="button" id="friend-manage" onClick={() => this.toggleFriendManagement()}>
            MANAGE FRIENDS
          </button>
          {friendListView}
        </div>
        {
          this.state.showPopup
            ? (
              <FriendTimetable
                title={`${friend[this.state.showindex].name}님의 시간표`}
                timetable={friend.filter((x) => x.id === this.state.showindex)[0].timetable}
                closePopup={() => this.changePopup(-1)}
              />
            )
            : null
        }
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
  onGetTimetableData: PropTypes.func.isRequired,
  storedUser: PropTypes.shape({
    is_authenticated: PropTypes.bool.isRequired,
    timetable_main: PropTypes.number.isRequired,
  }).isRequired,
  timetable_list: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        start_time: PropTypes.number.isRequired,
        end_time: PropTypes.number.isRequired,
        week_day: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        lecture_number: PropTypes.string.isRequired,
        course_number: PropTypes.string.isRequired,
      }),
    ),
  ).isRequired,
};
const mapStateToProps = (state) => ({
  storedUser: state.user.user,
  timetable_list: state.user.timetable_data,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onLogout: () => dispatch(actionCreators.getSignout()),
  onGetTimetableData: () => dispatch(actionCreators.getTimetableData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
