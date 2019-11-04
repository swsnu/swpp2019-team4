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
      
    };
  }

  componentDidMount() {
    this.props.onGetFriend();
  }

  render() {
    const friends = this.props.storedFriend.map((friend) => (
      <FriendView key={friend.username} username={friend.username}/>
    ));
    return (
      <div className="FriendManagement">
        <div className="FriendManagementIn">
          <div>HELLO, WORLD!</div>
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
  storedFriend: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  storedFriend: state.user.friend,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onGetFriend: () => dispatch(actionCreators.getFriend()),
});

export default connect(mapStateToProps, mapDispatchToProps)(FriendManagement);
