import React, { Component } from './node_modules/react';
import { connect } from './node_modules/react-redux';
import { Redirect, NavLink } from './node_modules/react-router-dom';
import * as actionCreators from '../../store/actions/index';
import TimetableView from '../../components/TimetableView/TimetableView';
import MainPageFriendListView from '../../components/MainPageFriendListView/MainPageFriendListView';

class Main extends Component {
    state = {
        
    }

    render() {
        return (
            <div className='Main'>
                <NavLink to='/main'>
                    <button id='timetable-management-button'>ASSA</button>
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
                <NavLink to='/login'>
                    <button id='logout-button'>LOGOUT</button>
                </NavLink>
                <br/>
                <TimetableView id='timetable-table'/>
                <MainPageFriendListView id='friend-list'/>
            </div>
        );
    }
};

export default connect(null, null)(Main);