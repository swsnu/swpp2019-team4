import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actionCreators from '../../store/actions/index';
import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      login_failed: false,
    };
  }

  componentDidMount() {
    this.props.onGetUser();
  }

  handleLogin() {
    this.props.onLogin(this.state.email, this.state.password)
      .then(() => {
        this.setState((prevState) => ({ ...prevState, login_failed: true }));
      });
  }

  goToSignup() {
    this.props.history.push('/signup');
  }

  enterKey() {
    if (window.event.keyCode === 13) {
      this.handleLogin();
    }
  }

  render() {
    if (this.props.storedUser.is_authenticated === true) {
      return (
        <Redirect to="/main" />
      );
    }
    const loginNotice = (this.state.login_failed ? '이메일 또는 비밀번호가 잘못되었습니다.' : '');
    return (
      <div className="Login background d-flex flex-column">
        <div className="row flex-grow-1" id="login-content">
          <div className="col-5 offset-2 d-flex flex-column justify-content-center">
            <h1 className="text-left mb-0">
              <b>
                <span className="first-letter"> a</span>
utomatic
                {' '}
              </b>
            </h1>
            <h1 className="text-left mb-0">
              <b>
                <span className="first-letter"> s</span>
cheduling&
                {' '}
              </b>
            </h1>
            <h1 className="text-left mb-0">
              <b>
                <span className="first-letter"> s</span>
haring
                {' '}
              </b>
            </h1>
            <h1 className="text-left mb-0">
              <b>
                <span className="first-letter"> a</span>
pplication
                {' '}
              </b>
            </h1>
          </div>
          <div className="col-4 offset-0 d-flex flex-column justify-content-center" id="login-area">
            <form>
              <div className="form-group my-2">
                <input
                  className="form-control "
                  type="text"
                  id="email-input"
                  value={this.state.email}
                  placeholder="Email"
                  onChange={(event) => this.setState({ email: event.target.value })}
                />
              </div>
              <div className="form-group my-2">
                <input
                  className={`form-control ${this.state.login_failed ? 'is-invalid' : ''}`}
                  type="password"
                  id="pw-input"
                  value={this.state.password}
                  placeholder="Password"
                  onChange={(event) => this.setState({ password: event.target.value })}
                  onKeyDown={() => this.enterKey()}
                />
                <div className="small text-danger text-left" id="login-notice"><b>{loginNotice}</b></div>
              </div>
            </form>
            <button
              className="btn btn-dark mb-2"
              type="button"
              id="login-button"
              onClick={() => this.handleLogin()}
            >
로그인
            </button>
            <small className="text-black-50"><b>또는</b></small>
            <button
              className="btn btn-outline-dark mt-2"
              type="button"
              id="to-signup-button"
              onClick={() => this.goToSignup()}
            >
회원가입
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  onGetUser: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  storedUser: PropTypes.shape({
    is_authenticated: PropTypes.bool.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  storedUser: state.user.user,
});

const mapDispatchToProps = (dispatch) => ({
  onLogin: (email, password) => dispatch(actionCreators.postSignin(email, password)),
  onGetUser: () => dispatch(actionCreators.getUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
