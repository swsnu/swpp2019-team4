import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actionCreators from '../../store/actions/index';

class Verify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: '',
      token: '',
      verify_status: false,
    };
  }

  componentDidMount() {
    this.getParams();
    this.props.onGetUser();
    this.props.onGetVerify(this.state.uid, this.state.token)
      .then(() => this.setState((prevState) => ({ ...prevState, verify_status: true })))
      .catch(() => this.setState((prevState) => ({ ...prevState, verify_status: false })));
  }

  getParams() {
    const { uid } = this.props.match.params;
    const { token } = this.props.match.params;
    this.setState((prevState) => ({ ...prevState, uid, token }));
  }

  goToLogin() {
    this.props.history.replace('/login');
  }

  render() {
    if (this.props.storedUser.is_authenticated === true) {
      return (
        <Redirect to="/main" />
      );
    }
    const verifyNotice = (this.state.verify_status ? '이메일 확인이 완료되었습니다.' : '부적절한 요청입니다.');
    return (
      <div className="Verify">
        <h3 id="notice">{verifyNotice}</h3>
        <button
          type="button"
          id="to-login-button"
          onClick={() => this.goToLogin()}
        >
로그인 화면으로 돌아가기
        </button>
      </div>
    );
  }
}

Verify.propTypes = {
  onGetUser: PropTypes.func.isRequired,
  onGetVerify: PropTypes.func.isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
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
