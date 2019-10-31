import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actionCreators from '../../store/actions/index';

class Signup extends Component {
    state = {}
    
    componentDidMount(){
        this.props.onGetUser();
    }

    render() {
        if(this.props.storedUser.is_authenticated == true) {
            return (
                <Redirect to='/main'/>
            );
        }
        return (
            <div className='Signup'>
                <h1>asdf</h1>
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
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);