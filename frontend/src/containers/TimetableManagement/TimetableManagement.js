import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes, { array } from 'prop-types';
import * as actionCreators from '../../store/actions/index';
import TimetableView from '../../components/TimetableView/TimetableView';
import TopBar from '../../components/TopBar/TopBar';
import TimetableRecommend from '../TimetableRecommend/TimetableRecommend';
import './TimetableManagement.css'

class TimetableManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      showCourses: true,
      searchStrings: '',
      timetableId: -1,
    };
  }

  componentDidMount() {
    this.props.onGetUser();
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
      this.props.onGetTimetables();
      this.props.onGetTimetable(this.state.timetableId);
    }
  }

  show(timetableId) {
    this.setState({ timetableId });
    this.props.onGetTimetable(timetableId);
    this.showCoursesInTimetable();
  }

  createEmptyTimetable() {
    this.props.onPostTimetable('new timetable', '2019-2');
  }

  showCoursesInSearch() {
    this.setState({showCourses:true})
  }

  showCoursesInTimetable() {
    this.setState({showCourses:false})
  }

  search() {
    this.props.onGetCourses(this.state.searchStrings);
    this.showCoursesInSearch();
  }

  render() {
    if (this.props.storedUser.is_authenticated === false) {
      return (
        <Redirect to="/login" />
      );
    }
    const timetableList = this.props.timetables.map((timetable) => (
      <li key={timetable.id} className={"tt "+timetable.id}>
        <button type="button" className="createTimetable" onClick={() => this.show(timetable.id)}>
          {timetable.title}
        </button>
      </li>
    ));
    let courseList;
    if (this.state.showCourses === true) {
      courseList = this.props.courses.map((course) => (
        <li key={course.id}>
          <button type="button" className="postCourse" onClick={() => this.post(course.id)}>
            {course.title}
          </button>
        </li>
      ));

    } else {
      let timetableDict = this.props.timetable;
      const names = timetableDict.map((timetable) => timetable.name)
      const uniqueTimetable = names.filter( (item, idx, array) => {
        return array.indexOf( item ) == idx;
      });
      courseList = uniqueTimetable.map((course) => (
        <li>
          <button type="button">{course}</button>
        </li>
      ))
    }
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
            />
            <button type="button" className="search" onClick={() => this.search()}>검색</button>
          </label>
        </div>
          <div className="searched-courses">
            <div className="label" id="label">
              <button className="button" type="button" onClick={() => this.showCoursesInSearch()}>과목검색</button>
              <button className="button" type="button" onClick={() => this.showCoursesInTimetable()}>내 과목</button>
            </div>
            <ul>
              {courseList}
            </ul>
          </div>
        <div className="timetable">
          <TimetableView
            id="timetable-table"
            height={24}
            width={60}
            courses={this.props.timetable}
            text
            link
            title=""
          />
        </div>
          <div className="timetable-list">
            <ul>
              {timetableList}
            </ul>
          </div>
        <div className="manage-timetable-buttons">
          <button type="button" id="delete-button">DELETE</button>
          <button type="button" id="create-button" onClick={() => this.createEmptyTimetable()}>CREATE</button>
          <button type="button" id="timetable-recommend-button" onClick={() => this.statePopup(true)}>RECOMMEND</button>
        {
          this.state.showPopup
            ? (
              <TimetableRecommend
                timetable={[]}
                closePopup={() => this.statePopup(false)}
              />
            )
            : null
        }
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
  timetables: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
  ).isRequired,
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
  ).isRequired,
  timetable: PropTypes.arrayOf(
    PropTypes.shape({

    }),
  ).isRequired,
  storedUser: PropTypes.shape({
    is_authenticated: PropTypes.bool.isRequired,
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
  onGetTimetables: () => dispatch(actionCreators.getTimetables()),
  onGetCourses: (searchStrings) => dispatch(actionCreators.getCourses(searchStrings)),
  onGetTimetable: (timetableId) => dispatch(actionCreators.getTimetable(timetableId)),
  onPostTimetable: (timetableName, semester) => dispatch(actionCreators.postTimetable(timetableName, semester)),
  onPostCourse: (title, courseId) => dispatch(actionCreators.postCourse(title, courseId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimetableManagement);
