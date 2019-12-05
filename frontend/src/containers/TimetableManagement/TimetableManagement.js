import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actionCreators from '../../store/actions/index';
import TimetableView from '../../components/TimetableView/TimetableView';
import SearchBar from '../../components/SearchBar/SearchBar';
import TopBar from '../../components/TopBar/TopBar';
import CourseElement from './CourseElement/CourseElement';
import CustomCourse from '../CustomCourse/CustomCourse';
// import './TimetableManagement.css';

class TimetableManagement extends Component {
  constructor(props) {
    super(props);
    this.is_mount = false;
    this.state = {
      semester: '2019-2',
      title: '',
      showCourses: true,
      searchdetail: false,
      scrollLimit: 1500,
      searchCourseCount: 50,
      searching: false,
      searchValues: {
        title: '',
        classification: '',
        department: '',
        degree_program: '',
        academic_year: '',
        course_number: '',
        lecture_number: '',
        professor: '',
        language: '',
        min_credit: '',
        max_credit: '',
        min_score: '',
        max_score: '',
      },
      realValues: {
        title: '',
        classification: '',
        department: '',
        degree_program: '',
        academic_year: '',
        course_number: '',
        lecture_number: '',
        professor: '',
        language: '',
        min_credit: '',
        max_credit: '',
        min_score: '',
        max_score: '',
      },
      commandMatch: 0,
    };
  }

  componentDidMount() {
    this.is_mount = true;
    this.props.onGetUser()
      .then(() => {
        if (this.is_mount) {
          this.props.onGetTimetable(this.props.storedUser.timetable_main)
            .then(() => {
              if (this.is_mount) {
                this.setState({ title: this.props.timetable.title });
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
    this.props.onGetTimetables();
    this.props.setCourses(0, 49, this.state.searchValues);
  }

  componentWillUnmount() {
    this.is_mount = false;
  }

  handleLogout() {
    this.props.onLogout();
  }

  postCourse(courseId) {
    this.props.onPostCourse(this.props.timetable.id, courseId);
  }

  deleteCourse(courseId) {
    this.props.onDeleteCourse(courseId);
  }

  deleteTimetable(timetableId) {
    this.props.onDeleteTimetable(timetableId);
  }

  show(timetableId, timetableTitle) {
    this.setState({
      title: timetableTitle,
    });
    this.props.onGetTimetable(timetableId);
    this.props.onPostMainTimetable(timetableId);
    this.showCoursesInTimetable();
  }

  createEmptyTimetable() {
    const titleBase = '새 시간표';
    let titleAdd = '';
    for (let idx = 1; idx < 100; idx += 1, titleAdd = ` (${idx})`) {
      const titleAll = titleBase + titleAdd;
      let isRepetition = false;
      this.props.timetables.forEach((timetable) => {
        if (timetable.title === titleAll) {
          isRepetition = true;
        }
      });
      if (!isRepetition) break;
    }

    const title = titleBase + titleAdd;

    this.props.onPostTimetable(title, '2019-2')
      .then(() => {
        if (this.is_mount) {
          this.show(this.props.timetables[this.props.timetables.length - 1].id, title);
        }
      })
      .catch(() => {});
  }

  showCoursesInSearch() {
    this.setState({ showCourses: true });
  }

  showCoursesInTimetable() {
    this.setState({ showCourses: false });
  }

  search() {
    if(this.state.searching)return;
    this.setState({searching:true});
    if (this.state.searchdetail) {
      this.setState({
        realValues: this.state.searchValues,
        scrollLimit: 1500,
        searchCourseCount: 50,
      });
      this.props.setCourses(0, 49, this.state.searchValues);
    } else {
      const newValue = {
        title: this.state.searchValues.title,
        classification: '',
        department: '',
        degree_program: '',
        academic_year: '',
        course_number: '',
        lecture_number: '',
        professor: '',
        language: '',
        min_credit: '',
        max_credit: '',
        min_score: '',
        max_score: '',
      };
      this.setState({
        realValues: newValue,
        scrollLimit: 1500,
        searchCourseCount: 50,
      });
      this.props.setCourses(0, 49, this.state.searchValues);
    }
    this.showCoursesInSearch();
  }

  editTimetableTitle(timetableTitle) {
    this.setState({ title: timetableTitle });
    this.props.onEditTimetable(this.props.timetable.id, timetableTitle);
  }

  enterKey() {
    const command = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    if (window.event.keyCode === command[this.state.commandMatch]) {
      if (this.state.commandMatch === 9) {
        const newValue = {
          title: '소프트웨어 개발의 원리와 실습',
          classification: '전필',
          department: '컴퓨터공학부',
          degree_program: '학사',
          academic_year: '3학년',
          course_number: 'M1522.002400',
          lecture_number: '001',
          professor: '전병곤',
          language: '영어',
          min_credit: '4',
          max_credit: '4',
          min_score: '',
          max_score: '',
        };
        this.setState({
          realValues: newValue,
          scrollLimit: 1500,
          searchCourseCount: 50,
          commandMatch: 0,
        });
        this.props.setCourses(0, 49, newValue);
      } else {
        this.setState({ commandMatch: this.state.commandMatch + 1 });
      }
    } else {
      this.setState({ commandMatch: 0 });
    }
    if (window.event.keyCode === 13) {
      this.search();
    }
  }

  handleMouseEnter(course) {
    const tempCourse = {
      ...course, temp: true, color: '#d3d3d3', opacity: 0.5,
    };
    if (this.props.course.filter((item) => item.course_number === course.course_number).length === 0) {
      this.props.onPostCourseTemp(tempCourse);
    }
  }

  handleMouseLeave(course) {
    this.props.onDeleteCourseTemp(course);
  }

  searchOnChange(event, type) {
    const newValue = this.state.searchValues;
    newValue[type] = event.target.value;
    this.setState({ searchValues: newValue });
  }

  onSearchToggle() {
    this.setState({ searchdetail: !this.state.searchdetail });
  }

  scrollHandler(scrollTop) {
    const pageSize = 50;
    const scrollSize = pageSize * 60;
    if (this.state.showCourses && this.state.scrollLimit < scrollTop) {
      this.setState({ scrollLimit: this.state.scrollLimit + scrollSize });
      this.props.onGetCourses(this.state.searchCourseCount, this.state.searchCourseCount + pageSize - 1, this.state.realValues);
      this.setState({ searchCourseCount: this.state.searchCourseCount + pageSize });
    }
  }

  render() {
    if (this.props.storedUser.is_authenticated === false) {
      return (
        <Redirect to="/login" />
      );
    }
    if(this.props.searched)
    {
      this.props.searchable();
      this.setState({searching:false});
    }
    const timetableList = this.props.timetables.filter((timetable) => timetable.id !== this.props.timetable.id)
      .map((item) => (
        <li key={item.id} className="dropdown-item p-0 d-flex">
          <button
            type="button"
            className="btn select-timetable-button flex-grow-1 text-left"
            onClick={() => this.show(item.id, item.title)}
          >
            {item.title}
          </button>
          <button
            type="button"
            className="btn btn-simple delete-button"
            onClick={() => this.deleteTimetable(item.id)}
          >
            <div className="oi oi-x small pb-2" />
          </button>
        </li>
      ));
    const searchedCourseList = this.props.courses.map((course) => (
      <CourseElement
        key={course.id}
        course={course}
        addon={[(
          <button
            key="1"
            type="button"
            className="btn btn-simple btn-sm"
            onMouseEnter={() => this.handleMouseEnter(course)}
            onMouseLeave={() => this.handleMouseLeave(course)}
            onClick={() => this.postCourse(course.id)}
          >
            <div className="oi oi-plus small" />
          </button>)]}
      />
    ));

    const timetableCourseList = this.props.timetable.course.map((course) => (
      <CourseElement
        key={course.id}
        course={course}
        addon={[(
          <button
            key="1"
            type="button"
            className="btn btn-simple btn-sm"
            onClick={() => this.deleteCourse(course.id)}
          >
            <div className="oi oi-minus small" />
          </button>)]}
      />
    ));

    return (
      <div className="Manage">
        <TopBar id="topbar" logout={() => this.handleLogout()} />
        <div className="row mx-5">
          <div className="col-6">
            <div className="dropdown">
              <button
                className="btn dropdown-toggle"
                type="button"
                id="semester-select"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {this.state.semester}
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdown-semester">
                <button type="button" className="dropdown-item" onClick={() => this.setState({ semester: '2019-2' })}>
                  2019-2
                </button>
              </div>
            </div>
            <SearchBar
              value={this.state.searchValues}
              onChange={(event, type) => this.searchOnChange(event, type)}
              onKeyDown={() => this.enterKey()}
              onSearch={() => this.search()}
              onToggle={() => this.onSearchToggle()}
              togglestatus={this.state.searchdetail}
              searchScore={false}
              searching={this.state.searching}
            />

            <ul className="nav nav-tabs nav-justified my-2" id="recommend-course-tab" role="tablist">
              <li className="nav-item">
                <a
                  className={`nav-link w-100 result-button ${this.state.showCourses ? 'active' : ''}`}
                  onClick={() => this.showCoursesInSearch()}
                  data-toggle="tab"
                  href="#searched-tab"
                  role="tab"
                  aria-controls="searched"
                  aria-selected="true"
                >
과목검색
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link w-100 timetable-button ${!this.state.showCourses ? 'active' : ''}`}
                  onClick={() => this.showCoursesInTimetable()}
                  data-toggle="tab"
                  href="#timetable-tab"
                  role="tab"
                  aria-controls="timetable"
                  aria-selected="false"
                >
내 과목
                </a>
              </li>
            </ul>

            <div className="tab-content overflow-y-auto mb-4" style={{ height: '420px' }} onScroll={(event) => { this.scrollHandler(event.target.scrollTop); }}>
              <div
                className={`tab-pane ${this.state.showCourses ? 'active' : ''}`}
                id="searched-tab"
                role="tabpanel"
                aria-labelledby="searched-tab"
              >
                {searchedCourseList}
              </div>
              <div
                className={`tab-pane ${!this.state.showCourses ? 'active' : ''}`}
                id="timetable-tab"
                role="tabpanel"
                aria-labelledby="timetable-tab"
              >
                {timetableCourseList}
                <button
                  type="button"
                  className="btn btn-simple"
                  data-toggle="modal"
                  data-target="#custom-course"
                  id="custom-course-button"
                >
                  <div className="oi oi-plus small px-2" />
                  커스텀 과목
                </button>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="dropdown d-flex justify-content-center">
              <input
                type="text"
                className="form-simple text-center w-50"
                id="timetable-title-input"
                value={this.state.title}
                onChange={(event) => this.setState({ title: event.target.value })}
                onBlur={() => this.props.onEditTimetable(this.props.timetable.id, this.state.title)}
              />
              <button
                className="btn dropdown-toggle"
                type="button"
                id="dropdown-timetable"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                aria-labelledby="Timetable Dropdown"
              />
              <div
                className="dropdown-menu dropdown-menu-right"
                id="timetable-list"
                aria-labelledby="dropdown-timetable"
              >
                {timetableList}
                <button
                  type="button"
                  className="dropdown-item text-center btn-simple"
                  id="create-button"
                  onClick={() => this.createEmptyTimetable()}
                >
                  <div className="oi oi-plus small" />
                </button>
              </div>
            </div>
            <TimetableView
              id="timetable-table"
              height={20}
              courses={this.props.timetable.course}
              editable
            />
            <CustomCourse
              id="custom-course"
              timetableId={this.props.timetable.id}
            />
          </div>
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
  onEditTimetable: PropTypes.func.isRequired,
  onPostTimetable: PropTypes.func.isRequired,
  onPostCourse: PropTypes.func.isRequired,
  onPostMainTimetable: PropTypes.func.isRequired,
  onDeleteCourse: PropTypes.func.isRequired,
  onDeleteTimetable: PropTypes.func.isRequired,
  timetables: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
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
    id: PropTypes.number,
    title: PropTypes.string,
    course: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      time: PropTypes.arrayOf(PropTypes.shape({
      })).isRequired,
    })),
  }).isRequired,
  storedUser: PropTypes.shape({
    is_authenticated: PropTypes.bool,
    timetable_main: PropTypes.number,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  storedUser: state.user.user,
  timetables: state.user.timetables,
  courses: state.user.courses,
  timetable: state.user.timetable,
  course: state.user.timetable.course,
  searched: state.user.searched
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onLogout: () => dispatch(actionCreators.getSignout()),
  onGetCourses: (start, end, searchStrings) => dispatch(actionCreators.getCourses(start, end, searchStrings)),
  onGetTimetable: (timetableId) => dispatch(actionCreators.getTimetable(timetableId)),
  onPostTimetable: (timetableName, semester) => dispatch(actionCreators.postTimetable(timetableName, semester)),
  onPostCourse: (title, courseId) => dispatch(actionCreators.postCourse(title, courseId)),
  onGetTimetables: () => dispatch(actionCreators.getTimetables()),
  onPostMainTimetable: (id) => dispatch(actionCreators.postMainTimetable(id)),
  onDeleteCourse: (courseId) => dispatch(actionCreators.deleteCourse(courseId)),
  onDeleteTimetable: (timetableId) => dispatch(actionCreators.deleteTimetable(timetableId)),
  onEditTimetable: (timetableId, title) => dispatch(actionCreators.editTimetable(timetableId, title)),
  setCourses: (start, end, searchStrings) => dispatch(actionCreators.setCourses(start, end, searchStrings)),
  onPostCourseTemp: (tempCourse) => dispatch(actionCreators.postCourseTemp(tempCourse)),
  onDeleteCourseTemp: (course) => dispatch(actionCreators.deleteCourseTemp(course)),
  searchable: () => dispatch(actionCreators.setSearchable()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimetableManagement);
