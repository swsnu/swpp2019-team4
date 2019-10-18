import React, { Component } from './node_modules/react';
import { connect } from './node_modules/react-redux';
import { Redirect } from './node_modules/react-router-dom';
import * as actionCreators from '../../store/actions/index';

class Login extends Component {
    state = {
        username: '',
        password: '',
    }

    render() {
        return (
            <div className='Login'>
                <h1> '외쳐 킹영찬!' </h1>
            </div>
        );
    }
};

export default connect(null, null)(Login);