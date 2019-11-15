import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import TopBar from '../../components/TopBar/TopBar';
import * as actionCreators from '../../store/actions/index';
import './Friend.css';

class Friend extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.props.onGetUser();
    this.props.onGetFriend();
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

    return (
      <div className="Friend">
        <TopBar logout={() => this.handleLogout()} />
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
};

const mapStateToProps = (state) => ({
  storedUser: state.user.user,
  storedFriend: state.user.friend,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onGetFriend: () => dispatch(actionCreators.getFriend()),
  onLogout: () => dispatch(actionCreators.getSignout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Friend);
