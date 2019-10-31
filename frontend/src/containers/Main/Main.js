import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, NavLink } from 'react-router-dom';
import * as actionCreators from '../../store/actions/index';
import TimeTableView from '../../components/TimeTableView/TimeTableView';
import MainPageFriendListView from '../../components/MainPageFriendListView/MainPageFriendListView';
import TopBar from '../../components/TopBar/TopBar'

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
        if(this.props.storedUser.is_authenticated == false) {
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
        var courses=[
            {"week_day": 0, "start_time_index": 22, "end_time_index": 25, "course_name": "자료구조"},
            {"week_day": 2, "start_time_index": 22, "end_time_index": 25, "course_name": "자료구조"},
            {"week_day": 4, "start_time_index": 28, "end_time_index": 32, "course_name": "자료구조"},
            {"week_day": 0, "start_time_index": 28, "end_time_index": 31, "course_name": "전기전자회로"},
            {"week_day": 2, "start_time_index": 28, "end_time_index": 31, "course_name": "전기전자회로"},
            {"week_day": 0, "start_time_index": 31, "end_time_index": 34, "course_name": "컴퓨터구조"},
            {"week_day": 2, "start_time_index": 31, "end_time_index": 34, "course_name": "컴퓨터구조"},
            {"week_day": 1, "start_time_index": 31, "end_time_index": 33, "course_name": "프로그래밍의원리"},
            {"week_day": 3, "start_time_index": 31, "end_time_index": 33, "course_name": "프로그래밍의원리"},
            {"week_day": 3, "start_time_index": 37, "end_time_index": 41, "course_name": "프로그래밍의원리"},
            {"week_day": 2, "start_time_index": 26, "end_time_index": 28, "course_name": "컴공세미나"},
            {"week_day": 0, "start_time_index": 34, "end_time_index": 37, "course_name": "소프트웨어 개발의 원리와 실습"},
            {"week_day": 2, "start_time_index": 34, "end_time_index": 37, "course_name": "소프트웨어 개발의 원리와 실습"},
            {"week_day": 3, "start_time_index": 37, "end_time_index": 41, "course_name": "소프트웨어 개발의 원리와 실습"},
        ]
        return (
            <div className='Main'>
                <TopBar id='topbar'/>
                <button id='logout-button' onClick={() => this.handleLogout()}>LOGOUT</button>
                <br/>
                <TimeTableView id='timetable-table' courses={courses}/>
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