import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actionCreators from '../../store/actions/index';

class Login extends Component {
    state = {
        email: '',
        password: '',
    }

    handleLogin(){
        this.props.onLogin(this.state.email, this.state.password)
            .then(() => {
                if(!this.props.storedLogin) {
                    alert('이메일 또는 비밀번호가 잘못되었습니다.');
                }
            });
    }

    render() {
        let redirect = null;
        if(this.props.storedLogin) {
            redirect = <Redirect to='/main'/>
        }
        return (
            <div className='Login'>
                {redirect}
                <input type='text' id='email-input' value={this.state.email} placeholder='ID'
                    onChange={(event) => this.setState({email: event.target.value})}/>
                <input type='password' id='pw-input' value={this.state.pasword} placeholder='Password'
                    onChange={(event) => this.setState({password: event.target.value})}/>
                <button id='login-button' onClick={() => this.handleLogin()}>Login</button>
            </div>
        );
    }
};

const mapStateToProps = state => {
    return {
        storedLogin: state.user.logged_in,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onLogin: (email, password) =>
            dispatch(actionCreators.postSignin(email, password)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);