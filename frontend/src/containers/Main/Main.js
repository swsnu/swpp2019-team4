import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actionCreators from '../../store/actions/index';
import TimetableView from '../../components/TimetableView/TimetableView';
import MainPageFriendView from '../../components/MainPageFriendView/MainPageFriendView';
import TopBar from '../../components/TopBar/TopBar';
import FriendTimetable from '../../components/FriendTimetable/FriendTimetable';
import './Main.css';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      showindex: -1,
    };
  }

  componentDidMount() {
    this.props.onGetUser();
    this.props.onGetTimetables();
  }

  handleLogout() {
    this.props.onLogout();
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
        timetable: [{
          course: [{
            title: '소개원실 (테스트용)',
            course_number: 'M1522.002400',
            lecture_number: '001',
            color: '#FF0000',
            time: [{
              week_day: 3,
              start_time: 1110,
              end_time: 1170,
            }],
          }],
        }],
      },
      {
        id: 1,
        name: '구준서',
        timetable: [{
          course: [{
            title: '소개원실 (테스트용)',
            course_number: 'M1522.002400',
            lecture_number: '001',
            color: '#FF0000',
            time: [{
              week_day: 3,
              start_time: 1020,
              end_time: 1110,
            }],
          }],
        }],
      },
    ];

    let courses = [];
    if (this.props.timetables !== undefined && this.props.storedUser.timetable_main !== undefined) {
      const timetable = this.props.timetables.find(
        (table) => table.id === this.props.storedUser.timetable_main,
      );
      if (timetable !== undefined) {
        courses = timetable.course;
      }
    }

    const friendListView = friend.map((user) => (
      <MainPageFriendView friend={user} onClick={() => this.changePopup(user.id)} key={user.id} />
    ));
    return (
      <div className="Main">
        <TopBar id="topbar" logout={() => this.handleLogout()} />
        <div className="Content-left">
          <TimetableView id="timetable-table" height={24} width={80} courses={courses} text link title="TIMETABLE" />
        </div>
        <div className="Content-right">
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
      </div>
    );
  }
}

Main.propTypes = {
  onGetUser: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onGetTimetables: PropTypes.func.isRequired,
  storedUser: PropTypes.shape({
    is_authenticated: PropTypes.bool.isRequired,
    timetable_main: PropTypes.number.isRequired,
  }).isRequired,
  timetables: PropTypes.arrayOf(PropTypes.shape({
    course: PropTypes.arrayOf(PropTypes.shape({})),
  })).isRequired,
};

const mapStateToProps = (state) => ({
  storedUser: state.user.user,
  timetables: state.user.timetables,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onLogout: () => dispatch(actionCreators.getSignout()),
  onGetTimetables: () => dispatch(actionCreators.getTimetables()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
