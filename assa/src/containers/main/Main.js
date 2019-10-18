import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, NavLink } from 'react-router-dom';
import * as actionCreators from '../../store/actions/index';
import Timetableview from '../timetableview/Timetableview';

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
                <br/>
                <Timetableview id='timetable-table'/>
            </div>
        );
    }
};

export default connect(null, null)(Main);