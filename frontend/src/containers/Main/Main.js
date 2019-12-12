import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actionCreators from '../../store/actions/index';
import TimetableView from '../../components/TimetableView/TimetableView';
import MainPageFriendView from '../../components/MainPageFriendView/MainPageFriendView';
import TopBar from '../../components/TopBar/TopBar';
import './Main.css';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.props.onGetUser();
    this.props.onGetTimetables();
    this.props.onGetFriend();
  }

  gotoFriend(id) {
    this.props.history.push(`/friend#${id}`);
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

    let courses = [];
    if (this.props.timetables !== undefined && this.props.storedUser.timetable_main !== undefined) {
      const timetable = this.props.timetables.find(
        (table) => table.id === this.props.storedUser.timetable_main,
      );
      if (timetable !== undefined) {
        courses = timetable.course;
      }
    }

    const friendListView = this.props.storedFriend.map((friend) => (
      <MainPageFriendView friend={friend} onClick={() => this.gotoFriend(friend.id)} key={friend.id} />
    ));
    return (
      <div className="Main">
        <TopBar id="topbar" logout={() => this.handleLogout()} />
        <div className="row w-100">
          <div className="Content-left col-8 pl-5">
            <TimetableView id="timetable-table" height={20} courses={courses} timeline/>
          </div>
          <div className="Content-right col-4 pr-5">
            {friendListView}
          </div>
        </div>
      </div>
    );
  }
}

Main.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  onGetUser: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onGetTimetables: PropTypes.func.isRequired,
  storedUser: PropTypes.shape({
    is_authenticated: PropTypes.bool,
    timetable_main: PropTypes.number,
  }).isRequired,
  storedFriend: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  timetables: PropTypes.arrayOf(PropTypes.shape({
    course: PropTypes.arrayOf(PropTypes.shape({})),
  })).isRequired,
  onGetFriend: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  storedUser: state.user.user,
  storedFriend: state.user.friend,
  timetables: state.user.timetables,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onLogout: () => dispatch(actionCreators.getSignout()),
  onGetTimetables: () => dispatch(actionCreators.getTimetables()),
  onGetFriend: () => dispatch(actionCreators.getFriend()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
