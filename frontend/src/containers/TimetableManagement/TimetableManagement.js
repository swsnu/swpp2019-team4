import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actionCreators from '../../store/actions/index';
import TimeTableView from '../../components/TimeTableView/TimeTableView';
import TopBar from '../../components/TopBar/TopBar';

class Timetable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.onGetUser();
  }

  handleLogout() {
    this.props.onLogout();
  }

  render() {
    if (this.props.storedUser.is_authenticated === false) {
      return (
        <Redirect to="/login" />
      );
    }
    const courses = [];
    return (
      <div className="Timetable">
        <TopBar id="topbar" />
        <button type="button" id="logout-button" onClick={() => this.handleLogout()}>LOGOUT</button>
        <select id="semester-select">
          <option value="2019-1">2019-1</option>
          <option value="2019-s">2019-s</option>
          <option value="2019-2">2019-2</option>
          <option value="2019-w">2019-w</option>
        </select>
        <label htmlFor="courses">
          과목명
          <input id="courses" type="text" />
        </label>
        <ol>
          <li>소프트웨어 개발의 원리와 실습</li>
          <li>전기전자회로</li>
          <li>인터넷 보안과 프라이버시</li>
        </ol>
        <TimeTableView id="timetable-table" courses={courses} />
        <ol>
          <li>Timetable1</li>
          <li>Timetable2</li>
          <li>Timetable3</li>
        </ol>
        <NavLink to="/timetable/recommend">
          <button type="button" id="timetable-recommend-button">RECOMMEND</button>
        </NavLink>
      </div>
    );
  }
}

Timetable.propTypes = {
  onGetUser: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  storedUser: PropTypes.shape({
    is_authenticated: PropTypes.bool.isRequired,
  }).isRequired,
};
const mapStateToProps = (state) => ({
  storedUser: state.user.user,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onLogout: () => dispatch(actionCreators.getSignout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Timetable);
