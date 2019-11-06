import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actionCreators from '../../store/actions/index';
import TimetableView from '../../components/TimetableView/TimetableView';
import TopBar from '../../components/TopBar/TopBar';
import TimetableRecommend from '../TimetableRecommend/TimetableRecommend';

class TimetableManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      searchStrings: "",
      timetable_id: 0,
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

  post(course_id) {
    this.props.onPostCourse(this.state.timetable_id, course_id);
    this.props.onGetTimetables();
    this.props.onGetTimetable(this.state.timetable_id);
  }

  show(timetable_id) {
    this.setState({timetable_id: timetable_id})
    this.props.onGetTimetable(timetable_id);
  }

  search() {
    this.props.onGetCourses(this.state.searchStrings);
  }

  render() {
    if (this.props.storedUser.is_authenticated === false) {
      return (
        <Redirect to="/login" />
      );
    }

    const timetable_list = this.props.timetables.map((timetable) => (
      <li><button type="button" onClick = {() => this.show(timetable.id)}>{timetable.title}</button></li>
    ))
    console.log(this.props.courses)
    const course_list = this.props.courses.map((course) => (
      <li><button type="button" onClick ={() => this.post(course.id)}>{course.title}</button></li>
    ))
    console.log(this.state.timetable_id);
    console.log(this.props.timetable);
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
          <input
            id="courses"
            type="text"
            value={this.state.searchStrings}
            onChange={(event) => this.setState({ searchStrings: event.target.value })}
          />
          <button type="button" onClick={() => this.search()}>검색</button>
        </label>
        <ol>
          {course_list}
        </ol>
        <TimetableView id="timetable-table" 
          height={24} 
          width={100} 
          courses={this.props.timetable} 
          text={true}
          link 
          title="" />
        <ol>
          {timetable_list}
        </ol>
        <button type="button" id="delete-button">DELETE</button>
        <button type="button" id="create-button">CREATE</button>
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
  timetables: state.user.timetables,
  courses: state.user.courses,
  timetable: state.user.timetable,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onLogout: () => dispatch(actionCreators.getSignout()),
  onGetTimetables: () => dispatch(actionCreators.getTimetables()),
  onGetCourses: (searchStrings) => dispatch(actionCreators.getCourses(searchStrings)),
  onGetTimetable: (timetable_id) => dispatch(actionCreators.getTimetable(timetable_id)),
  onPostCourse: (timetable_id, course_id) => dispatch(actionCreators.postCourse(timetable_id, course_id))
});

export default connect(mapStateToProps, mapDispatchToProps)(TimetableManagement);
