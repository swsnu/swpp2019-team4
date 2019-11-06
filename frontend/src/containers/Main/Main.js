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
