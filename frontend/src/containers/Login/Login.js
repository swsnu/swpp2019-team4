import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
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
        if (this.props.storedUser.is_authenticated === false) {
          this.setState((prevState) => ({ ...prevState, login_failed: true }));
        }
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
        <h1><b> ASSA </b></h1>
        <br />
        <Form>
          <Form.Group as={Row}>
            <Form.Control
              type="text"
              id="email-input"
              value={this.state.email}
              placeholder="Email"
              onChange={(event) => this.setState({ email: event.target.value })}
            />
            <Form.Control
              type="password"
              id="pw-input"
              value={this.state.pasword}
              placeholder="Password"
              onChange={(event) => this.setState({ password: event.target.value })}
            />
          </Form.Group>
          <Button type="button" id="login-button" onClick={() => this.handleLogin()}>로그인</Button>
          <Button
            variant="outline-primary"
            type="button"
            id="to-signup-button"
            onClick={() => this.goToSignup()}
          >
회원가입
          </Button>
          <p id="login-notice">{loginNotice}</p>
        </Form>
        <br />
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
