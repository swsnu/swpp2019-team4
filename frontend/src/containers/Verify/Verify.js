import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actionCreators from '../../store/actions/index';

class Verify extends Component {
    componentDidMount(){
        this.props.onGetUser();
    }

    render () {
        if(this.props.storedUser.is_authenticated == true) {
            return (
                <Redirect to='/main'/>
            );
        }
        this.props.onGetVerify(this.props.match.params.uid, this.props.match.params.token);
        return (
            <Redirect to='/login/'/>
        );
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
        onGetVerify: (uid, token) =>
            dispatch(actionCreators.getVerify(uid, token)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Verify);