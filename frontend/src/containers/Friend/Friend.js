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
    this.is_mount = true;
    this.state = {
      email: '',
      message: '',
      friend_id: 0,
    };
  }

  componentDidMount() {
    this.props.onGetUser();
    this.props.onGetFriend();
    const anchor = parseInt(this.props.location.hash.replace('#', ''), 10);
    if (!Number.isNaN(anchor)) {
      this.setState((prevState) => (
        { ...prevState, friend_id: anchor }
      ));
    }
  }

  componentWillUnmount() {
    this.is_mount = false;
  }

  handleLogout() {
    this.props.onLogout();
  }

  handleTimetable(friend) {
    const id = friend === null ? 0 : friend.id;
    this.setState((prevState) => ({
      ...prevState, friend_id: prevState.friend_id === id ? 0 : id,
    }));
  }

  handleDeleteFriend(friend) {
    this.props.onDeleteFriend(friend.id).then(() => {
      if (this.is_mount && this.state.friend_id === friend.id) {
        this.setState((prevState) => ({
          ...prevState, friend_id: 0,
        }));
      }
    });
  }

  enterKey(event) {
    if (event.keyCode === 13) {
      this.handleSearch();
    }
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
    const currentFriend = this.props.storedFriend.find((friend) => friend.id === this.state.friend_id);

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
            className={`btn btn-sm ${friend.id !== this.state.friend_id ? 'btn-outline-primary' : 'btn-primary'}`}
            id="friend-view"
            type="button"
            onClick={() => this.handleTimetable(friend)}
          >
            보기
          </button>
        </div>
        <div className="px-2">
          <button
            className="btn btn-outline-danger btn-sm"
            id="friend-delete"
            type="button"
            onClick={() => this.handleDeleteFriend(friend)}
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

    return (
      <div className="Friend">
        <TopBar logout={() => this.handleLogout()} />
        <div className="row w-100">
          <div className="left-content col-7 pl-5">
            {
              currentFriend !== undefined
                ? (
                  <div>
                    <div style={{ height: '30px' }}>
                      <b>{currentFriend.username}</b>
                      님의 시간표
                    </div>
                    <TimetableView
                      id="timetable-table"
                      height={24}
                      courses={currentFriend.timetable_main.course}
                      timeline
                    />
                  </div>
                )
                : (
                  <div>
                    <div style={{ height: '30px' }} />
                    <TimetableView id="timetable-table" height={24} courses={[]} timeline />
                  </div>
                )
            }
          </div>
          <div className="right-content col-5 pr-5">
            <div className="d-flex flex-row rounded-sm">
              <div className="flex-grow-1 p-2">
                <input
                  className="form-control form-control-sm"
                  type="text"
                  id="email-input"
                  value={this.state.email}
                  placeholder="Email"
                  onChange={(event) => this.setState({ email: event.target.value, message: '' })}
                  onKeyDown={(event) => this.enterKey(event)}
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
            <div style={{ height: `${2}em` }}><small>{message}</small></div>
            <hr className="m-1" />
            <div className="overflow-auto" style={{ height: '33em' }}>
              <div
                className="d-flex justify-content-between align-items-center clickable px-3"
                data-toggle="collapse"
                data-target="#friend-receive-list"
              >
                <div className="small font-weight-bold">받은 신청</div>
                {friendsReceive.length !== 0
                  ? <div className="circle">{friendsReceive.length}</div> : null}
              </div>
              <hr className="m-1" />
              <div className="collapse" id="friend-receive-list">
                {friendsReceive}
              </div>
              <hr className="m-1" />

              <div
                className="d-flex justify-content-between align-items-center clickable px-3"
                data-toggle="collapse"
                data-target="#friend-send-list"
              >
                <div className="small font-weight-bold">보낸 신청</div>
                {friendsSend.length !== 0
                  ? <div className="circle">{friendsSend.length}</div> : null}
              </div>
              <hr className="m-1" />
              <div className="collapse" id="friend-send-list">
                {friendsSend}
              </div>
              <hr className="m-1" />

              <div
                className="d-flex justify-content-between align-items-center clickable px-3"
                data-toggle="collapse"
                data-target="#friend-list"
              >
                <div className="small font-weight-bold">친구</div>
                {friends.length !== 0
                  ? <div className="circle">{friends.length}</div> : null}
              </div>
              <hr className="m-1" />
              <div className="collapse show" id="friend-list">
                {friends}
              </div>
              <hr className="m-1" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Friend.propTypes = {
  location: PropTypes.shape({
    hash: PropTypes.string,
  }).isRequired,
  onGetUser: PropTypes.func.isRequired,
  onGetFriend: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  storedUser: PropTypes.shape({
    is_authenticated: PropTypes.bool,
  }).isRequired,
  storedFriend: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  storedFriendSend: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  storedFriendReceive: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  storedSearch: PropTypes.shape({
    exist: PropTypes.bool.isRequired,
    status: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
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
  storedSearch: state.user.search,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onGetFriend: () => dispatch(actionCreators.getFriend()),
  onLogout: () => dispatch(actionCreators.getSignout()),
  onPostSearch: (email) => dispatch(actionCreators.postUserSearch(email)),
  onReceiveFriend: (id) => dispatch(actionCreators.receiveFriend(id)),
  onDeleteFriend: (id) => dispatch(actionCreators.deleteFriend(id)),
  onCancelFriend: (id) => dispatch(actionCreators.cancelFriend(id)),
  onRejectFriend: (id) => dispatch(actionCreators.rejectFriend(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Friend);
