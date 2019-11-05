import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actionCreators from '../../store/actions/index';
import TimetableView from '../../components/TimetableView/TimetableView';
import TopBar from '../../components/TopBar/TopBar';

class TimetableManagement extends Component {
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
      <div className="Manage">
        <TopBar id="topbar" logout={() => this.handleLogout()} />
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
          <li><button type="button">소프트웨어 개발의 원리와 실습</button></li>
          <li><button type="button">전기전자회로</button></li>
          <li><button type="button">인터넷 보안과 프라이버시</button></li>
        </ol>
        <TimetableView id="timetable-table" height={24} width={80} courses={courses} />
        <ol>
          <li><button type="button">Timetable1</button></li>
          <li><button type="button">Timetable2</button></li>
          <li><button type="button">Timetable3</button></li>
        </ol>
        <button type="button" id="delete-button">DELETE</button>
        <button type="button" id="create-button">CREATE</button>
        <NavLink to="/timetable/recommend">
          <button type="button" id="timetable-recommend-button">RECOMMEND</button>
        </NavLink>
      </div>
    );
  }
}

TimetableManagement.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(TimetableManagement);
