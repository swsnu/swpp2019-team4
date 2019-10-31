import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, NavLink } from 'react-router-dom';
import * as actionCreators from '../../store/actions/index';

import "./Signup.css";

class Signup extends Component {
    state = {
        email: '',
        password: '',
        password_confirm: '',
        username: '',
        grade: '1',
        department: '컴퓨터공학부',
    }
    
    componentDidMount(){
        this.props.onGetUser();
    }

    handleSignup (valid, email, password, username, department, grade) {
        if(valid) this.props.
    }

    render() {
        if(this.props.storedUser.is_authenticated == true) {
            return (
                <Redirect to='/main'/>
            );
        }
        let email_valid = (/^[^@\s]+@[^.@\s]+[.][^@\s]+$/.exec(this.state.email) == this.state.email);
        let password_valid = (8 <= this.state.password.length && this.state.password.length <= 32);
        let password_confirm_valid = (this.state.password === this.state.password_confirm)
        let username_valid = (1 <= this.state.username.length && this.state.username.length <= 16);
        let department_valid = (this.state.department === '컴퓨터공학부');
        let grade_valid = (1 <= 1*this.state.grade && 1*this.state.grade <= 99);

        let email_notice = (email_valid ? "" : "이메일 형식이 올바르지 않습니다.");
        let password_notice = (password_valid ? "" : "비밀번호는 8자 이상 32자 이하로 구성되어야 합니다.")
        let password_confirm_notice = (password_confirm_valid ? "" : "비밀번호와 비밀번호 확인은 같은 값을 가져야 합니다.")
        let username_notice = (username_valid ? "" : "이름은 1자 이상 32자 이하로 구성되어야 합니다.")
        let department_notice = (department_valid ? "" : "존재하는 학과를 입력해야 합니다.");
        let grade_notice = (grade_valid ? "" : "학년은 1 이상 99 이하의 정수여야 합니다.");
        return (
            <div className='Signup'>
                <h2>Welcome to ASSA!</h2>
                이메일: <input type='text' id='email-input' value={this.state.email} 
                                onChange={(event) => this.setState({email: event.target.value})}/> <br/>
                <p className='violation-notice'>{email_notice}</p>
                비밀번호: <input type='password' id='password-input' value={this.state.password} 
                                onChange={(event) => this.setState({password: event.target.value})}/> <br/>
                <p className='violation-notice'>{password_notice}</p>
                비밀번호 확인: <input type='password' id='password-confirm-input' value={this.state.password_confirm} 
                                onChange={(event) => this.setState({password_confirm: event.target.value})}/> <br/>
                <p className='violation-notice'>{password_confirm_notice}</p>
                이름: <input type='text' id='username-input' value={this.state.username} 
                                onChange={(event) => this.setState({username: event.target.value})}/> <br/>
                <p className='violation-notice'>{username_notice}</p>
                학과: <input type='text' id='department-input' value={this.state.department} 
                                onChange={(event) => this.setState({department: event.target.value})}/> <br/>
                <p className='violation-notice'>{department_notice}</p>
                학년: <input type='number' id='grade-input' value={this.state.grade} 
                                onChange={(event) => this.setState({grade: event.target.value})}/> <br/>
                <p className='violation-notice'>{grade_notice}</p>
                <br/>
                <NavLink to='/login'>
                    <button id='to-login-button'>뒤로가기</button>
                </NavLink>
                <button id='confirm-signup-button' 
                        onClick={() => this.handleSignup(email_valid && password_valid && password_confirm_valid && username_valid && department_valid && grade_valid,
                                                         this.state.email,
                                                         this.state.password,
                                                         this.state.username,
                                                         this.state.department,
                                                         this.state.grade)}>가입하기</button>
            </div>  
        )
    }
}

const mapStateToProps = state => {
    return {
        storedUser: state.user.user,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onGetUser: () =>
            dispatch(actionCreators.getUser()),
        onPostSignup: (email, password, username, department, grade) =>
            dispatch(actionCreators.postSignup(email, password, username, department, grade)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);