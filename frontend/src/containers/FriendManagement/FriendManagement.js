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
    this.props.onPostSearch('');
  }

  onEmailChange(email) {
    this.setState({ email: email });
    this.props.onPostSearch(email);
  }

  render() {
    const friends = this.props.storedFriend.map((friend) => (
      <div key={friend.id}>
        <span>{friend.username}</span>
        <span>
          <button id="email-input" onClick={() => this.props.onDeleteFriend(friend.id)}>
            X
          </button>
        </span>
      </div>
    ));
    const friends_send = this.props.storedFriendSend.map((friend) => (
      <div key={friend.id}>
        <span>{friend.username}</span>
        <span>
          <button id="email-input" onClick={() => this.props.onDeleteFriend(friend.id)}>
            X
          </button>
        </span>
      </div>
    ));
    const friends_receive = this.props.storedFriendReceive.map((friend) => (
      <div key={friend.id}>
        <span>{friend.username}</span>
        <span>
          <button id="email-input" onClick={() => this.props.onDeleteFriend(friend.id)}>
            X
          </button>
        </span>
      </div>
    ));
    return (
      <div className="FriendManagement">
        <div className="FriendManagementIn">
          <div>HELLO, WORLD!</div>
          <input
            type="text"
            id="email-input"
            value={this.state.email}
            placeholder="Email"
            onChange={(event) => this.onEmailChange(event.target.value)}
          />
          {this.props.storedSearch.id
            ? <div>{`${this.props.storedSearch.id} ${this.props.storedSearch.username}`}</div>
            : null}
          <hr />
          <div>RECEIVE</div>
          {friends_receive}
          <hr />
          <div>SEND</div>
          {friends_send}
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
  onDeleteFriend: PropTypes.func.isRequired,
  onPostSearch: PropTypes.func.isRequired,
  storedFriend: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  storedSearch: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  storedFriend: state.user.friend,
  storedFriendSend: state.user.friend_send,
  storedFriendReceive: state.user.friend_recieve,
  storedSearch: state.user.search,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onGetFriend: () => dispatch(actionCreators.getFriend()),
  onPostSearch: (email) => dispatch(actionCreators.postUserSearch(email)),
  onDeleteFriend: (id) => dispatch(actionCreators.deleteFriend(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FriendManagement);
