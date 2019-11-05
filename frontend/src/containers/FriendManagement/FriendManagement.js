import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './FriendManagement.css';
import FriendView from '../../components/FriendView/FriendView';
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

  onEmailChange(email) {
    this.setState({ email });
    this.props.onPostSearch(email);
  }

  render() {
    const friends = this.props.storedFriend.map((friend) => (
      <FriendView key={friend.id} username={friend.username} />
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
          <button type="button" onClick={this.props.onClose}>CLOSE</button>
          {friends}
        </div>
      </div>
    );
  }
}

FriendManagement.propTypes = {
  onClose: PropTypes.func.isRequired,
  onGetFriend: PropTypes.func.isRequired,
  onPostSearch: PropTypes.func.isRequired,
  storedFriend: PropTypes.arrayOf.isRequired,
  storedSearch: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  storedFriend: state.user.friend,
  storedSearch: state.user.search,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onGetFriend: () => dispatch(actionCreators.getFriend()),
  onPostSearch: (email) => dispatch(actionCreators.postUserSearch(email)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FriendManagement);
