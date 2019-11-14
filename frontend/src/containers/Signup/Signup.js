import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import FrontBar from '../../components/FrontBar/FrontBar';
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
      grade: '',
      department: '컴퓨터공학부',
      email_sending: 0,
    };
  }

  componentDidMount() {
    this.props.onGetUser();
  }

  handleSignup(email, password, username, department, grade) {
    this.setState((prevState) => ({ ...prevState, email_sending: 1 }));
    this.props.onPostSignup(email, password, username, department, grade)
      .then(() => this.setState((prevState) => ({ ...prevState, email_sending: 2 })))
      .catch(() => this.setState((prevState) => ({ ...prevState, email_sending: 3 })));
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
    const emailValid = (regexValid !== null || this.state.email_sending != 3);
    const passwordValid = ((this.state.password.length >= 8 && this.state.password.length <= 32) || this.state.email_sending != 3);
    const passwordConfirmValid = (this.state.password === this.state.password_confirm || this.state.email_sending != 3);
    const usernameValid = ((this.state.username.length >= 1 && this.state.username.length <= 16) || this.state.email_sending != 3);
    const departmentValid = ((this.state.department === '컴퓨터공학부') || this.state.email_sending != 3);
    const gradeValid = ((1 * this.state.grade >= 1 && 1 * this.state.grade <= 99) || this.state.email_sending != 3);

    const emailNotice = (emailValid ? '' : '이메일 형식이 올바르지 않습니다.');
    const passwordNotice = (passwordValid ? '' : '비밀번호는 8자 이상 32자 이하로 구성되어야 합니다.');
    const passwordConfirmNotice = (passwordConfirmValid ? '' : '비밀번호와 비밀번호 확인은 같은 값을 가져야 합니다.');
    const usernameNotice = (usernameValid ? '' : '이름은 1자 이상 32자 이하로 구성되어야 합니다.');
    const departmentNotice = (departmentValid ? '' : '존재하는 학과를 입력해야 합니다.');
    const gradeNotice = (gradeValid ? '' : '학년은 1 이상 99 이하의 정수여야 합니다.');

    const emailSendNotice = ['가입하기 버튼을 누르면 입력한 이메일로 확인 메일이 발송됩니다.',
      '이메일 보내는 중...',
      '입력한 이메일로 확인 메일을 발송했습니다. 이메일 확인 절차를 마치면 계정이 생성됩니다.',
      '메일을 발송하지 못했습니다. 이메일을 다시 한 번 확인해 주시기 바랍니다.'][this.state.email_sending];
    return (
      <div className="Signup background">
        <FrontBar />
        <div className="col-4 offset-4">
          <form>
            <div className="form-group">
              <input
                className={`form-control ${emailValid ? '' : 'is-invalid'}`}
                type="text"
                id="email-input"
                placeholder="Email"
                value={this.state.email}
                onChange={(event) => this.setState({ email: event.target.value })}
              />
              <div className="small text-left violation-notice feedback">{emailNotice}</div>
              <input
                className={`form-control ${passwordValid ? '' : 'is-invalid'}`}
                type="password"
                id="password-input"
                placeholder="Password"
                value={this.state.password}
                onChange={(event) => this.setState({ password: event.target.value })}
              />
              <div className="small text-left violation-notice feedback">{passwordNotice}</div>
              <input
                className={`form-control ${passwordConfirmValid ? '' : 'is-invalid'}`}
                type="password"
                id="password-confirm-input"
                value={this.state.password_confirm}
                placeholder="Password Confirmation"
                onChange={(event) => this.setState({ password_confirm: event.target.value })}
              />
              <div className="small text-left violation-notice feedback">{passwordConfirmNotice}</div>
              <input
                className={`form-control ${usernameValid ? '' : 'is-invalid'}`}
                type="text"
                id="username-input"
                value={this.state.username}
                placeholder="Username"
                onChange={(event) => this.setState({ username: event.target.value })}
              />
              <div className="small text-left violation-notice feedback">{usernameNotice}</div>
              <input
                className={`form-control ${departmentValid ? '' : 'is-invalid'}`}
                type="text"
                id="department-input"
                value={this.state.department}
                placeholder="Department"
                onChange={(event) => this.setState({ department: event.target.value })}
              />
              <div className="small text-left violation-notice feedback">{departmentNotice}</div>
              <input
                className={`form-control ${gradeValid ? '' : 'is-invalid'}`}
                type="number"
                id="grade-input"
                value={this.state.grade}
                placeholder="Grade"
                onChange={(event) => this.setState({ grade: event.target.value })}
              />
              <div className="small text-left violation-notice feedback">{gradeNotice}</div>
            </div>
            <div className="row m-0">
            <button
              className="btn btn-outline-dark col mr-1"
              type="button"
              id="to-login-button"
              disabled={this.state.email_sending === 1}
              onClick={() => this.goToLogin()}
            >
뒤로가기
            </button>
            <button
              className="btn btn-dark col ml-1"
              type="button"
              id="confirm-signup-button"
              disabled={
            (this.state.email_sending === 1)
            || !(emailValid && passwordValid && passwordConfirmValid && usernameValid && departmentValid && gradeValid)
          }
              onClick={() => this.handleSignup(this.state.email,
                this.state.password,
                this.state.username,
                this.state.department,
                this.state.grade)}
            >
가입하기
            </button></div>
          </form>
        </div>
      </div>
    );
  }
}

Signup.propTypes = {
  onGetUser: PropTypes.func.isRequired,
  onPostSignup: PropTypes.func.isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
  storedUser: PropTypes.shape({
    is_authenticated: PropTypes.bool,
  }).isRequired,
};
const mapStateToProps = (state) => ({
  storedUser: state.user.user,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onPostSignup: (email, password, username, department, grade) => dispatch(
    actionCreators.postSignup(email, password, username, department, grade),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
