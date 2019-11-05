import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actionCreators from '../../store/actions/index';

import './Signup.css';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      password_confirm: '',
      username: '',
      grade: '1',
      department: '컴퓨터공학부',
    };
  }

  componentDidMount() {
    this.props.onSetSendStatus(0);
    this.props.onGetUser();
  }

  handleSignup(email, password, username, department, grade) {
    this.props.onSetSendStatus(1);
    this.props.onPostSignup(email, password, username, department, grade);
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
    const regexValid = /^[^@\s]+@[^.@\s]+[.][^@\s]+$/.exec(this.state.email);
    const emailValid = (regexValid !== null);
    const passwordValid = (this.state.password.length >= 8 && this.state.password.length <= 32);
    const passwordConfirmValid = (this.state.password === this.state.password_confirm);
    const usernameValid = (this.state.username.length >= 1 && this.state.username.length <= 16);
    const departmentValid = (this.state.department === '컴퓨터공학부');
    const gradeValid = (1 * this.state.grade >= 1 && 1 * this.state.grade <= 99);

    const emailNotice = (emailValid ? '' : '이메일 형식이 올바르지 않습니다.');
    const passwordNotice = (passwordValid ? '' : '비밀번호는 8자 이상 32자 이하로 구성되어야 합니다.');
    const passwordConfirmNotice = (passwordConfirmValid ? '' : '비밀번호와 비밀번호 확인은 같은 값을 가져야 합니다.');
    const usernameNotice = (usernameValid ? '' : '이름은 1자 이상 32자 이하로 구성되어야 합니다.');
    const departmentNotice = (departmentValid ? '' : '존재하는 학과를 입력해야 합니다.');
    const gradeNotice = (gradeValid ? '' : '학년은 1 이상 99 이하의 정수여야 합니다.');

    const emailSendNotice = ['가입하기 버튼을 누르면 입력한 이메일로 확인 메일이 발송됩니다.'
                            ,'이메일 보내는 중...'
                            ,'입력한 이메일로 확인 메일을 발송했습니다. 이메일 확인 절차를 마치면 계정이 생성됩니다.'
                            ,'메일을 발송하지 못했습니다. 이메일을 다시 한 번 확인해 주시기 바랍니다.'][this.props.email_sending];
    return (
      <div className="Signup">
        <h2>Welcome to ASSA!</h2>
                이메일:
        {' '}
        <input
          type="text"
          id="email-input"
          value={this.state.email}
          onChange={(event) => this.setState({ email: event.target.value })}
        />
        {' '}
        <br />
        <p className="violation-notice">{emailNotice}</p>
                비밀번호:
        {' '}
        <input
          type="password"
          id="password-input"
          value={this.state.password}
          onChange={(event) => this.setState({ password: event.target.value })}
        />
        {' '}
        <br />
        <p className="violation-notice">{passwordNotice}</p>
                비밀번호 확인:
        {' '}
        <input
          type="password"
          id="password-confirm-input"
          value={this.state.password_confirm}
          onChange={(event) => this.setState({ password_confirm: event.target.value })}
        />
        {' '}
        <br />
        <p className="violation-notice">{passwordConfirmNotice}</p>
                이름:
        {' '}
        <input
          type="text"
          id="username-input"
          value={this.state.username}
          onChange={(event) => this.setState({ username: event.target.value })}
        />
        {' '}
        <br />
        <p className="violation-notice">{usernameNotice}</p>
                학과:
        {' '}
        <input
          type="text"
          id="department-input"
          value={this.state.department}
          onChange={(event) => this.setState({ department: event.target.value })}
        />
        {' '}
        <br />
        <p className="violation-notice">{departmentNotice}</p>
                학년:
        {' '}
        <input
          type="number"
          id="grade-input"
          value={this.state.grade}
          onChange={(event) => this.setState({ grade: event.target.value })}
        />
        {' '}
        <br />
        <p className="violation-notice">{gradeNotice}</p>
        <br />
        <button
          type="button"
          id="to-login-button"
          disabled={this.props.email_sending == 1}
          onClick={() => this.goToLogin()}
        >
뒤로가기
        </button>
        <button
          type="button"
          id="confirm-signup-button"
          disabled={
            (this.props.email_sending == 1)
            || !(emailValid && passwordValid && passwordConfirmValid && usernameValid && departmentValid && gradeValid)
          }
          onClick={() => this.handleSignup(this.state.email,
            this.state.password,
            this.state.username,
            this.state.department,
            this.state.grade)}
        >
가입하기
        </button>
        <br />
        {emailSendNotice}
      </div>
    );
  }
}

Signup.propTypes = {
  onSetSendStatus: PropTypes.func.isRequired,
  onGetUser: PropTypes.func.isRequired,
  onPostSignup: PropTypes.func.isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
  storedUser: PropTypes.shape({
    is_authenticated: PropTypes.bool,
  }).isRequired,
  email_sending: PropTypes.bool.isRequired,
};
const mapStateToProps = (state) => ({
  storedUser: state.user.user,
  email_sending: state.user.email_sending,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onPostSignup: (email, password, username, department, grade) => dispatch(
    actionCreators.postSignup(email, password, username, department, grade),
  ),
  onSetSendStatus: (status) => dispatch(actionCreators.setSendStatus(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
