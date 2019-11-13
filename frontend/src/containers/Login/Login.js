import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';
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
    this.props.history.replace('/signup');
  }

  render() {
    if (this.props.storedUser.is_authenticated === true) {
      return (
        <Redirect to="/main" />
      );
    }
    const loginNotice = (this.state.login_failed ? '이메일 또는 비밀번호가 잘못되었습니다.' : '');
    return (
      <div className="Login">
        <div className="row">
        <div className="col d-flex flex-column ml-5 justify-content-center">
          <h1 className="text-left mb-0"><b><span className="first-letter"> a</span>utomatic </b></h1>
          <h1 className="text-left mb-0"><b><span className="first-letter"> s</span>cheduling& </b></h1>
          <h1 className="text-left mb-0"><b><span className="first-letter"> s</span>haring </b></h1>
          <h1 className="text-left mb-0"><b><span className="first-letter"> a</span>pplication </b></h1>
        </div>
        <div className="col d-flex flex-column justify-content-center">
          <form>
            <div className="form-group m-2">
              <input className={"form-control "}
                type="text"
                id="email-input"
                value={this.state.email}
                placeholder="Email"
                onChange={(event) => this.setState({ email: event.target.value })}
              />
              </div>
            <div className="form-group m-2">
              <input className={"form-control " + (this.state.login_failed ? "is-invalid" : "")}
                type="password"
                id="pw-input"
                value={this.state.pasword}
                placeholder="Password"
                onChange={(event) => this.setState({ password: event.target.value })}
              />
             <div className="small invalid-feedback text-left" id="login-notice">{loginNotice}</div>
             </div>
          </form>
            <button className="btn btn-dark m-2" type="button" id="login-button" onClick={() => this.handleLogin()}>로그인</button>
            <div><NavLink className="text-body" to="signup"><small><b>회원가입</b></small></NavLink>
            </div>
        </div></div>
      </div>
    );
  }
}

Login.propTypes = {
  onGetUser: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
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
