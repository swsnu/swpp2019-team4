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
        inclass: false,
        timeleft: '2147483647',
        timetable: [],
      },
      {
        id: 1,
        name: '구준서',
        inclass: false,
        timeleft: '2147483647',
        timetable: [
          {
            name: '소프트웨어 개발의 원리와 실습',
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
        inclass: true,
        timeleft: '2147483647',
        timetable: [],
      },
      {
        id: 3,
        name: '김현수',
        inclass: false,
        timeleft: '2147483647',
        timetable: [],
      },
    ];
    const friendListView = friend.map((user) => (
      <MainPageFriendView friend={user} onClick={() => this.changePopup(user.id)} key={user.id} />
    ));
    return (
      <div className="Main">
        <TopBar id="topbar" logout={() => this.handleLogout()} />
        <br />
        <div className="Content-left">
          <TimetableView id="timetable-table" height={24} width={80} courses={[]} text link title="TIMETABLE" />
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
