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
      department: '',

      email_valid: true,
      password_valid: true,
      password_confirm_valid: true,
      username_valid: true,
      grade_valid: true,
      department_valid: true,

      email_notice: '',
      password_notice: '',
      password_confirm_notice: '',
      username_notice:'',
      grade_notice:'',
      department_notice: '',

      is_waiting: false,
    };
  }

  componentDidMount() {
    this.props.onGetUser();
  }

  handleSignup(email, password, password_confirm, username, department, grade) {
    const regexValid = /^[^@\s]+@[^.@\s]+[.][^@\s]+$/.exec(email);
    const emailValid = (regexValid !== null);
    const passwordValid = (password.length >= 8 && password.length <= 32);
    const passwordConfirmValid = (password === password_confirm);
    const usernameValid = (username.length >= 1 && username.length <= 16);
    const departmentValid = (department === '컴퓨터공학부');
    const gradeValid = (1 * grade >= 1 && 1 * grade <= 99);
    const sendValid = emailValid && passwordValid && passwordConfirmValid && usernameValid &&
     departmentValid && gradeValid;

    const emailNotice = (emailValid ? '' : '이메일 형식이 올바르지 않습니다.');
    const passwordNotice = (passwordValid ? '' : '비밀번호는 8자 이상 32자 이하로 구성되어야 합니다.');
    const passwordConfirmNotice = (passwordConfirmValid ? '' : '비밀번호와 비밀번호 확인은 같은 값을 가져야 합니다.');
    const usernameNotice = (usernameValid ? '' : '이름은 1자 이상 32자 이하로 구성되어야 합니다.');
    const gradeNotice = (gradeValid ? '' : '학년은 1 이상 99 이하의 정수여야 합니다.');
    const departmentNotice = (departmentValid ? '' : '존재하는 학과를 입력해야 합니다.');

    this.setState((prevState) => ({ ...prevState, email_valid: emailValid, password_valid: passwordValid,
      password_confirm_valid: passwordConfirmValid, username_valid: usernameValid, department_valid: departmentValid,
      grade_valid: gradeValid, email_notice: emailNotice, password_notice: passwordNotice,
      password_confirm_notice: passwordConfirmNotice, username_notice: usernameNotice, department_notice: departmentNotice,
      grade_notice: gradeNotice}));
    if (sendValid) {
      this.setState((prevState) => ({ ...prevState, is_waiting: true}));
      this.props.onPostSignup(email, password, username, department, grade)
        .then(() => {
          this.props.history.push('/login');
        })
        .catch(() => this.setState((prevState) => ({ ...prevState, email_valid: false, is_waiting: false,
          email_notice: '이미 존재하는 이메일입니다.'
        })));
    }
  }

  goToLogin() {
    this.props.history.push('/login');
  }

  render() {
    if (this.props.storedUser.is_authenticated === true) {
      return (
        <Redirect to="/main" />
      );
    }

    return (
      <div className="Signup background">
        <FrontBar />
        <div className="col-4 offset-4">
          <form>
            <div className="form-group">
              <input
                className={`form-control ${this.state.email_valid ? '' : 'is-invalid'}`}
                type="text"
                id="email-input"
                placeholder="Email"
                value={this.state.email}
                onChange={(event) => this.setState({ email: event.target.value })}
              />
              <div className="small text-left violation-notice feedback">{this.state.email_notice}</div>
              <input
                className={`form-control ${this.state.password_valid ? '' : 'is-invalid'}`}
                type="password"
                id="password-input"
                placeholder="Password"
                value={this.state.password}
                onChange={(event) => this.setState({ password: event.target.value })}
              />
              <div className="small text-left violation-notice feedback">{this.state.password_notice}</div>
              <input
                className={`form-control ${this.state.password_confirm_valid ? '' : 'is-invalid'}`}
                type="password"
                id="password-confirm-input"
                value={this.state.password_confirm}
                placeholder="Password Confirmation"
                onChange={(event) => this.setState({ password_confirm: event.target.value })}
              />
              <div className="small text-left violation-notice feedback">{this.state.password_confirm_notice}</div>
              <input
                className={`form-control ${this.state.username_valid ? '' : 'is-invalid'}`}
                type="text"
                id="username-input"
                value={this.state.username}
                placeholder="Username"
                onChange={(event) => this.setState({ username: event.target.value })}
              />
              <div className="small text-left violation-notice feedback">{this.state.username_notice}</div>
              <input
                className={`form-control ${this.state.department_valid ? '' : 'is-invalid'}`}
                type="text"
                id="department-input"
                value={this.state.department}
                placeholder="Department"
                onChange={(event) => this.setState({ department: event.target.value })}
              />
              <div className="small text-left violation-notice feedback">{this.state.department_notice}</div>
              <input
                className={`form-control ${this.state.grade_valid ? '' : 'is-invalid'}`}
                type="number"
                id="grade-input"
                value={this.state.grade}
                placeholder="Grade"
                onChange={(event) => this.setState({ grade: event.target.value })}
              />
              <div className="small text-left violation-notice feedback">{this.state.grade_notice}</div>
            </div>
            <div className="row m-0">
            <button
              className="btn btn-outline-dark col mr-1"
              type="button"
              id="to-login-button"
              onClick={() => this.goToLogin()}
            >
뒤로가기
            </button>
            <button
              className="btn btn-dark col ml-1"
              type="button"
              id="confirm-signup-button"
              disabled={this.state.is_waiting}
              onClick={() => this.handleSignup(this.state.email,
                this.state.password,
                this.state.password_confirm,
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
