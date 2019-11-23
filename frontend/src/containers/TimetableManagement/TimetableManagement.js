import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actionCreators from '../../store/actions/index';
import TimetableView from '../../components/TimetableView/TimetableView';
import SideView from '../../components/SideView/SideView';
import TopBar from '../../components/TopBar/TopBar';
import './TimetableManagement.css';

class TimetableManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCourses: true,
      searchStrings: '',
      timetableId: -1,
    };
  }

  componentDidMount() {
    this.props.onGetUser()
      .then(() => {
        this.setState((prevState) => ({ ...prevState, timetableId: this.props.storedUser.timetable_main }));
        this.props.onGetTimetable(this.props.storedUser.timetable_main);
      });
    this.props.onGetTimetables();
  }

  statePopup(value) {
    this.setState((prevState) => ({ ...prevState, showPopup: value }));
  }

  handleLogout() {
    this.props.onLogout();
  }

  post(courseId) {
    if (this.state.timetableId !== -1) {
      this.props.onPostCourse(this.state.timetableId, courseId);
      this.props.onGetTimetable(this.state.timetableId);
    }
  }

  show(timetableId) {
    this.setState({ timetableId });
    this.props.onGetTimetable(timetableId);
    this.props.onPostMainTimetable(timetableId);
    this.showCoursesInTimetable();
  }

  createEmptyTimetable() {
    this.props.onPostTimetable('new timetable', '2019-2');
  }

  showCoursesInSearch() {
    this.setState({ showCourses: true });
  }

  showCoursesInTimetable() {
    this.setState({ showCourses: false });
  }

  search() {
    this.props.onGetCourses(this.state.searchStrings);
    this.showCoursesInSearch();
  }

  enterKey() {
    if (window.event.keyCode === 13) {
      this.search();
    }
  }

  render() {
    if (this.props.storedUser.is_authenticated === false) {
      return (
        <Redirect to="/login" />
      );
    }
    const timetableList = (
      <SideView
        list={this.props.timetables}
        className="timetable-list"
        onClick={(id) => this.show(id)}
      />
    );

    const courseList = (
      <SideView
        list={this.state.showCourses ? this.props.courses : this.props.timetable.course}
        className="course-list"
        onClick={(id) => this.post(id)}
      />
    );
    return (
      <div className="Manage">
        <TopBar id="topbar" logout={() => this.handleLogout()} />
        <div className="searchBar">
          <select id="semester-select">
            <option value="2019-1">2019-1</option>
            <option value="2019-s">2019-s</option>
            <option value="2019-2">2019-2</option>
            <option value="2019-w">2019-w</option>
          </select>
          <label className="input-courses" htmlFor="courses">
            과목명
            <input
              id="courses"
              type="text"
              value={this.state.searchStrings}
              onChange={(event) => this.setState({ searchStrings: event.target.value })}
              onKeyDown={() => this.enterKey()}
            />
            <button type="button" className="search" onClick={() => this.search()}>검색</button>
          </label>
        </div>
        <div className="searched-courses">
          <div className="label" id="label">
            <button className="result-button" type="button" onClick={() => this.showCoursesInSearch()}>과목검색</button>
            <button
              className="timetable-button"
              type="button"
              onClick={() => this.showCoursesInTimetable()}
            >
            내 과목
            </button>
          </div>
          {courseList}
        </div>
        <div className="timetable">
          <TimetableView
            id="timetable-table"
            height={24}
            width={60}
            courses={this.props.timetable.course}
            text
            link
          />
        </div>
        {timetableList}
        <div className="manage-timetable-buttons">
          <button type="button" id="delete-button">DELETE</button>
          <button type="button" id="create-button" onClick={() => this.createEmptyTimetable()}>CREATE</button>
        </div>
      </div>
    );
  }
}

TimetableManagement.propTypes = {
  onGetUser: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onGetTimetables: PropTypes.func.isRequired,
  onGetCourses: PropTypes.func.isRequired,
  onGetTimetable: PropTypes.func.isRequired,
  onPostTimetable: PropTypes.func.isRequired,
  onPostCourse: PropTypes.func.isRequired,
  onPostMainTimetable: PropTypes.func.isRequired,
  timetables: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      timetable_main: PropTypes.number.isRequired,
    }),
  ).isRequired,
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      time: PropTypes.arrayOf(PropTypes.shape({
      })).isRequired,
    }),
  ).isRequired,
  timetable: PropTypes.shape({
    course: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      time: PropTypes.arrayOf(PropTypes.shape({
      })).isRequired,
    })),
  }).isRequired,
  storedUser: PropTypes.shape({
    is_authenticated: PropTypes.bool.isRequired,
    timetable_main: PropTypes.number.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  storedUser: state.user.user,
  timetables: state.user.timetables,
  courses: state.user.courses,
  timetable: state.user.timetable,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onLogout: () => dispatch(actionCreators.getSignout()),
  onGetCourses: (searchStrings) => dispatch(actionCreators.getCourses(searchStrings)),
  onGetTimetable: (timetableId) => dispatch(actionCreators.getTimetable(timetableId)),
  onPostTimetable: (timetableName, semester) => dispatch(actionCreators.postTimetable(timetableName, semester)),
  onPostCourse: (title, courseId) => dispatch(actionCreators.postCourse(title, courseId)),
  onGetTimetables: () => dispatch(actionCreators.getTimetables()),
  onPostMainTimetable: (id) => dispatch(actionCreators.postMainTimetable(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimetableManagement);
