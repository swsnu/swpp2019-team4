import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actionCreators from '../../store/actions/index';

class Verify extends Component {
  componentDidMount() {
    this.props.onGetUser();
    this.props.onGetVerify(this.props.match.params.uid, this.props.match.params.token);
  }

  render() {
    if (this.props.storedUser.is_authenticated === true) {
      return (
        <Redirect to="/main" />
      );
    }
    return (
      <Redirect to="/login/" />
    );
  }
}

Verify.propTypes = {
  onGetUser: PropTypes.func.isRequired,
  onGetVerify: PropTypes.func.isRequired,
  storedUser: PropTypes.shape({
    is_authenticated: PropTypes.bool.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      uid: PropTypes.string.isRequired,
      token: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  storedUser: state.user.user,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onGetVerify: (uid, token) => dispatch(actionCreators.getVerify(uid, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Verify);
