import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './FriendManagement.css';
import * as actionCreators from '../../store/actions/index';

class FriendManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  componentDidMount() {
    this.props.onGetFriend();
  }

  componentWillUnmount() {
    //this.props.onPostSearch('');
  }

  handleSearch() {
    this.props.onPostSearch(this.state.email);
  }

  render() {
    const friends = this.props.storedFriend.map((friend) => (
      <div key={friend.id}>
        <span>{friend.username}</span>
        <span>
          <button id="email-input" type="button" onClick={() => this.props.onDeleteFriend(friend.id)}>
            X
          </button>
        </span>
      </div>
    ));
    const friendsSend = this.props.storedFriendSend.map((friend) => (
      <div key={friend.id}>
        <span>{friend.username}</span>
      </div>
    ));
    const friendsReceive = this.props.storedFriendReceive.map((friend) => (
      <div key={friend.id}>
        <span>{friend.username}</span>
        <span>
          <button
            id="email-input"
            type="button"
            onClick={() => this.props.onReceiveFriend(friend.id)}
          >
            O
          </button>
        </span>
      </div>
    ));
    return (
      <div className="FriendManagement">
        <div className="FriendManagementIn">
          <div>HELLO, WORLD!</div>
          <span>
          <input
            type="text"
            id="email-input"
            value={this.state.email}
            placeholder="Email"
            onChange={(event) => this.setState({email: event.target.value})}
          /></span>
          <span>
          <button
            id="email-input"
            type="button"
            onClick={() => this.handleSearch()}
          > O </button>
          </span>
          <hr />
          <div>RECEIVE</div>
          {friendsReceive}
          <hr />
          <div>SEND</div>
          {friendsSend}
          <hr />
          <div>FRIENDS</div>
          {friends}
          <hr />
          <button type="button" onClick={this.props.onClose}>CLOSE</button>
        </div>
      </div>
    );
  }
}

FriendManagement.propTypes = {
  onClose: PropTypes.func.isRequired,
  onGetFriend: PropTypes.func.isRequired,
  onReceiveFriend: PropTypes.func.isRequired,
  onDeleteFriend: PropTypes.func.isRequired,
  onPostSearch: PropTypes.func.isRequired,
  storedFriend: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  storedFriendSend: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  storedFriendReceive: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  storedSearch: PropTypes.shape({
    exist: PropTypes.bool.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  storedFriend: state.user.friend,
  storedFriendSend: state.user.friend_send,
  storedFriendReceive: state.user.friend_receive,
  storedSearch: state.user.search,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onGetFriend: () => dispatch(actionCreators.getFriend()),
  onPostSearch: (email) => dispatch(actionCreators.postUserSearch(email)),
  onReceiveFriend: (id) => dispatch(actionCreators.receiveFriend(id)),
  onDeleteFriend: (id) => dispatch(actionCreators.deleteFriend(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FriendManagement);
