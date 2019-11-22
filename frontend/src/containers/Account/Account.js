import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';
import TopBar from '../../components/TopBar/TopBar';
import * as actionCreators from '../../store/actions/index';
import './Account.css';

class Account extends Component {
  constructor(props) {
    super(props);
    this.is_mount = true;
    this.state = {
      show_modal: false,

      password_prev: '',
      password: '',
      password_confirm: '',
      username: '',
      grade: '',
      department: '',

      password_prev_valid: true,
      password_valid: true,
      password_confirm_valid: true,
      username_valid: true,
      grade_valid: true,
      department_valid: true,

      password_prev_notice: '',
      password_notice: '',
      password_confirm_notice: '',
      username_notice: '',
      grade_notice: '',
      department_notice: '',

      is_waiting: false,
      is_finished: false,
    };
  }

  componentDidMount() {
    this.props.onGetUser().then(() => {
      if (this.is_mount) {
        this.setState((prevState) => ({
          ...prevState,
          username: this.props.storedUser.username,
          grade: this.props.storedUser.grade,
          department: this.props.storedUser.department,
        }));
      }
    })
      .catch(() => {});
  }

  componentWillUnmount() {
    this.is_mount = false;
  }

  handleLogout() {
    this.props.onLogout();
  }

  toggleModal() {
    this.setState((prevState) => ({ ...prevState, show_modal: !prevState.show_modal }));
  }

  handleChange(passwordPrev, password, passwordConfirm, username, department, grade) {
    const passwordChange = (password !== '' || passwordConfirm !== '' || passwordPrev !== '');
    const passwordPrevValid = (passwordPrev !== '') || !passwordChange;
    const passwordValid = (password.length >= 8 && password.length <= 32) || !passwordChange;
    const passwordConfirmValid = (password === passwordConfirm) || !passwordChange;
    const usernameValid = (username.length >= 1 && username.length <= 16);
    const departmentValid = (department === '컴퓨터공학부');
    const gradeValid = (1 * grade >= 1 && 1 * grade <= 99);
    const sendValid = passwordPrevValid && passwordValid && passwordConfirmValid && usernameValid
     && departmentValid && gradeValid;

    const passwordPrevNotice = (passwordPrevValid ? '' : '기존 비밀번호를 입력해야 합니다.');
    const passwordNotice = (passwordValid ? '' : '비밀번호는 8자 이상 32자 이하로 구성되어야 합니다.');
    const passwordConfirmNotice = (passwordConfirmValid ? '' : '비밀번호와 비밀번호 확인은 같은 값을 가져야 합니다.');
    const usernameNotice = (usernameValid ? '' : '이름은 1자 이상 32자 이하로 구성되어야 합니다.');
    const gradeNotice = (gradeValid ? '' : '학년은 1 이상 99 이하의 정수여야 합니다.');
    const departmentNotice = (departmentValid ? '' : '존재하는 학과를 입력해야 합니다.');

    this.setState((prevState) => ({
      ...prevState,
      password_prev_valid: passwordPrevValid,
      password_valid: passwordValid,
      password_confirm_valid: passwordConfirmValid,
      username_valid: usernameValid,
      department_valid: departmentValid,
      grade_valid: gradeValid,
      password_prev_notice: passwordPrevNotice,
      password_notice: passwordNotice,
      password_confirm_notice: passwordConfirmNotice,
      username_notice: usernameNotice,
      department_notice: departmentNotice,
      grade_notice: gradeNotice,
    }));
    if (sendValid) {
      this.setState((prevState) => ({ ...prevState, is_waiting: true }));
      let info = { username, department, grade };
      if (passwordChange) info = { ...info, password_prev: passwordPrev, password };
      this.props.onPutUser(info)
        .then(() => this.setState((prevState) => ({
          ...prevState,
          is_waiting: false,
          show_modal: true,
          password_prev: '',
          password: '',
          password_confirm: '',
        })))
        .catch(() => this.setState((prevState) => ({
          ...prevState,
          is_waiting: false,
          password_prev_valid: false,
          password_prev_notice: '잘못된 비밀번호입니다.',
        })));
    }
  }

  render() {
    if (this.props.storedUser.is_authenticated === false) {
      return (
        <Redirect to="/login" />
      );
    }

    return (
      <div className="Account">
        <TopBar logout={() => this.handleLogout()} />
        <div className="row mt-5 w-100">
          <div className="col-5">
            <h5 className="text-left pl-5 mb-4"> 기본정보 수정</h5>
            <table className="w-100">
              <colgroup>
                <col span="1" style={{ width: '30%' }} />
                <col span="1" style={{ width: '70%' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td className="text-right">
                    Email
                  </td>
                  <td className="text-left pl-3 pt-1 align-top">
                    {this.props.storedUser.email}
                  </td>
                </tr>
                <tr>
                  <td className="text-right">
                    <label htmlFor="username-input">Username</label>
                  </td>
                  <td className="form-group">
                    <input
                      className={`form-control ${this.state.username_valid ? '' : 'is-invalid'}`}
                      type="text"
                      id="username-input"
                      value={this.state.username}
                      onChange={(event) => this.setState({ username: event.target.value })}
                    />
                    <div className="small text-left text-danger feedback">{this.state.username_notice}</div>
                  </td>
                </tr>
                <tr>
                  <td className="text-right">
                    <label htmlFor="department-input">Department</label>
                  </td>
                  <td>
                    <input
                      className={`form-control ${this.state.department_valid ? '' : 'is-invalid'}`}
                      type="text"
                      id="department-input"
                      value={this.state.department}
                      onChange={(event) => this.setState({ department: event.target.value })}
                    />
                    <div className="small text-left text-danger feedback">{this.state.department_notice}</div>
                  </td>
                </tr>
                <tr>
                  <td className="text-right">
                    <label htmlFor="grade-input">Grade</label>
                  </td>
                  <td>
                    <input
                      className={`form-control ${this.state.grade_valid ? '' : 'is-invalid'}`}
                      type="number"
                      id="grade-input"
                      value={this.state.grade}
                      onChange={(event) => this.setState({ grade: event.target.value })}
                    />
                    <div className="small text-left text-danger feedback">{this.state.grade_notice}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-5 offset-1">
            <h5 className="text-left pl-5 mb-4"> 비밀번호 변경 </h5>
            <table className="w-100">
              <colgroup>
                <col span="1" style={{ width: '30%' }} />
                <col span="1" style={{ width: '70%' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td className="text-right">
                    <label htmlFor="password-prev-input">Old Password</label>
                  </td>
                  <td className="form-group">
                    <input
                      className={`form-control ${this.state.password_prev_valid ? '' : 'is-invalid'}`}
                      type="password"
                      id="password-prev-input"
                      value={this.state.password_prev}
                      onChange={(event) => this.setState({ password_prev: event.target.value })}
                    />
                    <div className="small text-left text-danger feedback">{this.state.password_prev_notice}</div>
                  </td>
                </tr>
                <tr>
                  <td className="text-right">
                    <label htmlFor="password-input">New Password</label>
                  </td>
                  <td>
                    <input
                      className={`form-control ${this.state.password_valid ? '' : 'is-invalid'}`}
                      type="password"
                      id="password-input"
                      value={this.state.password}
                      onChange={(event) => this.setState({ password: event.target.value })}
                    />
                    <div className="small text-left text-danger feedback">{this.state.password_notice}</div>
                  </td>
                </tr>
                <tr>
                  <td className="text-right">
                    <label htmlFor="password-confirm-input">Retype Password</label>
                  </td>
                  <td>
                    <input
                      className={`form-control ${this.state.password_confirm_valid ? '' : 'is-invalid'}`}
                      type="password"
                      id="password-confirm-input"
                      value={this.state.password_confirm}
                      onChange={(event) => this.setState({ password_confirm: event.target.value })}
                    />
                    <div className="small text-left text-danger feedback">{this.state.password_confirm_notice}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <button
          className="btn btn-dark"
          type="button"
          id="confirm-signup-button"
          disabled={this.state.is_waiting}
          onClick={() => this.handleChange(this.state.password_prev,
            this.state.password,
            this.state.password_confirm,
            this.state.username,
            this.state.department,
            this.state.grade)}
        >
          수정하기
        </button>
        <Modal isOpen={this.state.show_modal} id="account-change-message" centered>
          <div className="modal-title w-100">
            <div className="oi oi-check w-100 text-success text-center m-3" style={{ fontSize: '5em' }} />
            <h4 className="text-center m-3"> 내용이 변경되었습니다. </h4>
          </div>
          <div className="modal-footer w-100">
            <button type="button" className="btn btn-outline-dark mx-auto" onClick={() => this.toggleModal()}>
              닫기
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

Account.propTypes = {
  onGetUser: PropTypes.func.isRequired,
  onPutUser: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  storedUser: PropTypes.shape({
    is_authenticated: PropTypes.bool,
    email: PropTypes.string,
    username: PropTypes.string,
    grade: PropTypes.number,
    department: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  storedUser: state.user.user,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onPutUser: (params) => dispatch(actionCreators.putUser(params)),
  onLogout: () => dispatch(actionCreators.getSignout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Account);
