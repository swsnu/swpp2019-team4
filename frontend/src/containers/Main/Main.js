import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, NavLink } from 'react-router-dom';
import * as actionCreators from '../../store/actions/index';
import TimeTableView from '../../components/TimeTableView/TimeTableView';
import MainPageFriendListView from '../../components/MainPageFriendListView/MainPageFriendListView';

class Main extends Component {
    state = {
        
    }

    componentDidMount(){
        this.props.onGetUser();
    }

    handleLogout() {
        this.props.onLogout();
    }

    render() {
        if(!this.props.storedUser.is_authenticated) {
            return (
                <Redirect to='/login'/>
            );
        }
        var friend=[
            {id: 1, name: "정재윤", inclass: false, timeleft: "2147483647"},
            {id: 2, name: "구준서", inclass: false, timeleft: "2147483647"},
            {id: 3, name: "김영찬", inclass: true, timeleft: "2147483647"},
            {id: 4, name: "김현수", inclass: false, timeleft: "2147483647"},
        ]
        return (
            <div className='Main'>
                <NavLink to='/main'>
                    <button id='assa-logo-button'>ASSA</button>
                </NavLink>
                <NavLink to=''>
                    <button id='timetable-management-button'>TIMETABLE</button>
                </NavLink>
                <NavLink to=''>
                    <button id='friend-button'>FRIEND</button>
                </NavLink>
                <NavLink to=''>
                    <button id='personal-information-button'>INFORMATION</button>
                </NavLink>
                <button id='logout-button' onClick={() => this.handleLogout()}>LOGOUT</button>
                <br/>
                <TimeTableView id='timetable-table'/>
                <MainPageFriendListView id='friend-list' friends={friend}/>
            </div>
        );
    }
};

const mapStateToProps = state => {
    return {
        storedUser: state.user.user,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onGetUser: () =>
            dispatch(actionCreators.getUser()),
        onLogout: () =>
            dispatch(actionCreators.getSignout()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);