import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import TopBar from '../../components/TopBar/TopBar';
import TimetableView from '../../components/TimetableView/TimetableView';
import * as actionCreators from '../../store/actions/index';
import './Friend.css';

class Friend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      message: '',
      id_focus: -1,
    };
  }

  componentDidMount() {
    this.props.onGetUser();
    this.props.onGetFriend();
  }

  handleLogout() {
    this.props.onLogout();
  }

  handleTimetable(friend) {
    this.props.onGetTimetableFriend(friend.timetable_main)
      .then(() => {
        this.setState((prevState) => ({
          ...prevState, id_focus: friend.timetable_main,
        }));
      });
  }

  handleSearch() {
    this.props.onPostSearch(this.state.email)
      .then(() => {
        let message = '';
        if (this.props.storedSearch.exist) {
          switch (this.props.storedSearch.status) {
            case 'PENDING':
              message = `${this.props.storedSearch.username} 님에게 친구 신청을 보냈습니다.`;
              break;
            case 'FRIEND':
              message = `${this.props.storedSearch.username} 님과 친구가 되었습니다.`;
              break;
            default:
          }
        } else {
          switch (this.props.storedSearch.status) {
            case 'NULL':
            case 'USER':
              message = '잘못된 이메일 주소입니다.';
              break;
            case 'SENT':
              message = '이미 친구 신청을 보냈습니다.';
              break;
            case 'FRIEND':
              message = '이미 친구인 상태입니다.';
              break;
            default:
          }
        }
        this.setState((prevState) => ({ ...prevState, message }));
      });
  }

  render() {
    if (this.props.storedUser.is_authenticated === false) {
      return (
        <Redirect to="/login" />
      );
    }
    const { message } = this.state;
    const friends = this.props.storedFriend.map((friend) => (
      <div
        className="d-flex flex-row p-2"
        key={friend.id}
        onClick={() => this.handleTimetable(friend)}
        role="button"
        tabIndex="0"
        onKeyDown={() => {}}
      >
        <div className="text-left px-2">
          {' '}
          {friend.username}
          {' '}
        </div>
        <div className="flex-grow-1 text-black-50 text-left px-2">
          <small>
            {friend.email}
          </small>
        </div>
        <div className="px-2">
          <button
            className="btn btn-outline-danger btn-sm"
            id="friend-cancel"
            type="button"
            onClick={() => this.props.onDeleteFriend(friend.id)}
          >
            삭제
          </button>
        </div>
      </div>
    ));

    const friendsSend = this.props.storedFriendSend.map((friend) => (
      <div className="d-flex flex-row p-2" key={friend.id}>
        <div className="text-left px-2">
          {' '}
          {friend.username}
          {' '}
        </div>
        <div className="flex-grow-1 text-black-50 text-left px-2">
          <small>
            {friend.email}
          </small>
        </div>
        <div className="px-2">
          <button
            className="btn btn-outline-warning btn-sm"
            id="friend-cancel"
            type="button"
            onClick={() => this.props.onCancelFriend(friend.id)}
          >
            취소
          </button>
        </div>
      </div>
    ));

    const friendsReceive = this.props.storedFriendReceive.map((friend) => (
      <div className="d-flex flex-row p-2" key={friend.id}>
        <div className="text-left px-2">
          {' '}
          {friend.username}
          {' '}
        </div>
        <div className="flex-grow-1 text-black-50 text-left px-2">
          <small>
            {friend.email}
          </small>
        </div>
        <div className="px-2">
          <button
            className="btn btn-outline-success btn-sm"
            id="friend-receive"
            type="button"
            onClick={() => this.props.onReceiveFriend(friend.id)}
          >
            승인
          </button>
        </div>
        <div className="px-2">
          <button
            className="btn btn-outline-danger btn-sm"
            id="friend-reject"
            type="button"
            onClick={() => this.props.onRejectFriend(friend.id)}
          >
            거절
          </button>
        </div>
      </div>
    ));

    let courses = [];
    if (this.state.id_focus >= 0) {
      courses = this.props.storedTimetableFriend.course;
    }

    return (
      <div className="Friend">
        <TopBar logout={() => this.handleLogout()} />
        <div className="row w-100">
          <div className="left-content col-6 offset-1">
            <TimetableView id="timetable-table" height={24} width={80} courses={courses} text link title="TIMETABLE" />
          </div>
          <div className="right-content col-4">
            <div className="d-flex flex-row rounded-sm">
              <div className="flex-grow-1 p-2">
                <input
                  className="form-control form-control-sm"
                  type="text"
                  id="email-input"
                  value={this.state.email}
                  placeholder="Email"
                  onChange={(event) => this.setState({ email: event.target.value, message: '' })}
                />
              </div>
              <div className="p-2">
                <button
                  className="btn btn-outline-primary btn-sm"
                  id="email-search"
                  type="button"
                  onClick={() => this.handleSearch()}
                >
                추가
                </button>
              </div>
            </div>
            <div style={{ height: `${2}em` }}>{message}</div>
            <hr className="m-1" />
            <div className="overflow-auto">
              <div>RECEIVED</div>
              <hr className="m-1" />
              {friendsReceive}
              <hr className="m-1" />
              <div>SENT</div>
              <hr className="m-1" />
              {friendsSend}
              <hr className="m-1" />
              <div>FRIENDS</div>
              <hr className="m-1" />
              {friends}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Friend.propTypes = {
  onGetUser: PropTypes.func.isRequired,
  onGetFriend: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  storedUser: PropTypes.shape({
    is_authenticated: PropTypes.bool,
  }).isRequired,
  storedTimetableFriend: PropTypes.shape({
    course: PropTypes.arrayOf(),
  }).isRequired,
  storedFriend: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  storedFriendSend: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  storedFriendReceive: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  storedSearch: PropTypes.shape({
    exist: PropTypes.bool.isRequired,
    status: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
  onGetTimetableFriend: PropTypes.func.isRequired,
  onReceiveFriend: PropTypes.func.isRequired,
  onDeleteFriend: PropTypes.func.isRequired,
  onCancelFriend: PropTypes.func.isRequired,
  onRejectFriend: PropTypes.func.isRequired,
  onPostSearch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  storedUser: state.user.user,
  storedFriend: state.user.friend,
  storedFriendSend: state.user.friend_send,
  storedFriendReceive: state.user.friend_receive,
  storedTimetableFriend: state.user.timetable_friend,
  storedSearch: state.user.search,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onGetFriend: () => dispatch(actionCreators.getFriend()),
  onLogout: () => dispatch(actionCreators.getSignout()),
  onGetTimetableFriend: (id) => dispatch(actionCreators.getTimetableFriend(id)),
  onPostSearch: (email) => dispatch(actionCreators.postUserSearch(email)),
  onReceiveFriend: (id) => dispatch(actionCreators.receiveFriend(id)),
  onDeleteFriend: (id) => dispatch(actionCreators.deleteFriend(id)),
  onCancelFriend: (id) => dispatch(actionCreators.cancelFriend(id)),
  onRejectFriend: (id) => dispatch(actionCreators.rejectFriend(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Friend);
