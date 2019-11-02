import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actionCreators from '../../store/actions/index';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  componentDidMount() {
    this.props.onGetUser();
  }

  handleLogin() {
    this.props.onLogin(this.state.email, this.state.password);
  }

  goToSignup() {
    this.props.history.replace('/signup');
  }

  render() {
    if (this.props.storedUser.is_authenticated == true) {
      return (
        <Redirect to="/main" />
      );
    }
    return (
      <div className="Login">
        <input
          type="text"
          id="email-input"
          value={this.state.email}
          placeholder="Email"
          onChange={(event) => this.setState({ email: event.target.value })}
        />
        <input
          type="password"
          id="pw-input"
          value={this.state.pasword}
          placeholder="Password"
          onChange={(event) => this.setState({ password: event.target.value })}
        />
        <button id="login-button" onClick={() => this.handleLogin()}>로그인</button>
        <button id="to-signup-button" onClick={() => this.goToSignup()}>회원가입</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  storedUser: state.user.user,
});

const mapDispatchToProps = (dispatch) => ({
  onLogin: (email, password) => dispatch(actionCreators.postSignin(email, password)),
  onGetUser: () => dispatch(actionCreators.getUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
