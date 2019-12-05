import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SearchBar from '../../../components/SearchBar/SearchBar';
import './RecommendCourse.css';
import * as actionCreators from '../../../store/actions/index';

class RecommendCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      ratedScrollLimit: 1500,
      unratedScrollLimit: 1500,
      ratedCourseCount: 50,
      unratedCourseCount: 50,
      tabview: 0,
      searchdetail: false,
      commandMatch: 0,
    };
    this.timeToString = (time) => {
      const hour = parseInt(time / 60, 10);
      const hourString = (hour < 10 ? '0' : '') + hour;
      const minuteString = (time % 60 === 0 ? '' : '.5');
      return `${hourString}${minuteString}`;
    };
  }

  componentDidMount() {
    this.props.handleValid(true);
    this.props.setRatedCourse(0, 49, this.state.realValues);
    this.props.setUnratedCourse(0, 49, this.state.realValues);
  }

  segmentToString(weekDay, startTime) {
    const weekDayName = ['월', '화', '수', '목', '금', '토'];
    return `${weekDayName[weekDay]}${this.timeToString(startTime)}`;
  }

  scrollHandler(scrollTop) {
    const pageSize = 50;
    const scrollSize = pageSize * 60;
    if (this.state.tabview === 0 && this.state.ratedScrollLimit < scrollTop) {
      this.setState({ ratedScrollLimit: this.state.ratedScrollLimit + scrollSize });
      this.props.getRatedCourse(this.state.ratedCourseCount, this.state.ratedCourseCount + pageSize - 1, this.state.realValues);
      this.setState({ ratedCourseCount: this.state.ratedCourseCount + pageSize });
    } else if (this.state.tabview === 1 && this.state.unratedScrollLimit < scrollTop) {
      this.setState({ unratedScrollLimit: this.state.unratedScrollLimit + scrollSize });
      this.props.getUnratedCourse(this.state.unratedCourseCount, this.state.unratedCourseCount + pageSize - 1, this.state.realValues);
      this.setState({ unratedCourseCount: this.state.unratedCourseCount + pageSize });
    }
  }

  onSearchToggle() {
    this.setState({ searchdetail: !this.state.searchdetail });
  }

  changeTab(tab) {
    this.setState({ tabview: tab });
    this.props.onPutCoursePref(this.props.changedCourses);
    this.props.setRatedCourse(0, 49, this.state.realValues);
    this.props.setUnratedCourse(0, 49, this.state.realValues);
  }
  courseElement(course) {
    const colorGradient = [
      '#FC466B',
      '#E94879',
      '#D64A87',
      '#C34D96',
      '#B04FA4',
      '#9D52B3',
      '#8A54C1',
      '#7756CF',
      '#6459DE',
      '#515BEC',
      '#3F5EFB',
    ];
    const {score} = course;
    let timeString = '';
    for (let i = 0; i < course.time.length; i += 1) {
      timeString += this.segmentToString(course.time[i].week_day, course.time[i].start_time, course.time[i].end_time);
      if (i !== course.time.length - 1) {
        timeString += ' ';
      }
    }
    return (
      <div key={course.id}>
        <div className="expected_color" style={{backgroundColor:colorGradient[Math.round(course.expected)],height:'40px',width:'3px',float:"left"}}/>
        <div className="row">
          <div className="col-6">
            <div className="text-left">
              {`${course.title} (${course.lecture_number})`}
            </div>
            <div className="text-black-50 text-left small" id="recommend-course-abstract">
              {`${course.professor} | ${course.credit}학점 | ${timeString} | ${course.location}`}
            </div>
          </div>
          <div className="col-5 d-flex align-items-center">
            <div
              className="m-2 font-weight-bold text-center"
              id={`slider-value-${course.id}`}
              style={{ color: colorGradient[Math.round(score)], width: '30px' }}
            >
              {score}
            </div>
            <form className="flex-grow-1">
              <div className="form-group m-2">
                <input
                  type="range"
                  className="form-control-range"
                  min="0"
                  max="10"
                  id={`course-score-form-${course.id}`}
                  value={score}
                  onChange={(event) => this.props.onChangeslider(course.id, event.target.value)}
                  onClick={(event) => this.props.onChangeslider(course.id, event.target.value)}
                  onMouseDown={(event) => this.props.onChangeslider(course.id, event.target.value)}
                />
              </div>
            </form>
          </div>
        </div>
        <hr className="my-2" />
      </div>
    );
  }

  searchOnChange(event, type) {
    const newValue = this.state.searchValues;
    newValue[type] = event.target.value;
    this.setState({ searchValues: newValue });
  }

  search() {
    if (this.state.searchdetail) {
      this.setState({
        realValues: this.state.searchValues,
        ratedScrollLimit: 1500,
        unratedScrollLimit: 1500,
        ratedCourseCount: 50,
        unratedCourseCount: 50,
      });
      this.props.setRatedCourse(0, 49, this.state.searchValues);
      this.props.setUnratedCourse(0, 49, this.state.searchValues);
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
        ratedScrollLimit: 1500,
        unratedScrollLimit: 1500,
        ratedCourseCount: 50,
        unratedCourseCount: 50,
      });
      this.props.setRatedCourse(0, 49, newValue);
      this.props.setUnratedCourse(0, 49, newValue);
    }
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
          ratedScrollLimit: 1500,
          unratedScrollLimit: 1500,
          ratedCourseCount: 50,
          unratedCourseCount: 50,
          commandMatch: 0,
        });
        this.props.setRatedCourse(0, 49, newValue);
        this.props.setUnratedCourse(0, 49, newValue);
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

  render() {
    const ratedview = [];
    const unratedview = [];
    if (this.props.ratedCourse !== undefined) {
      for (let i = 0; i < this.props.ratedCourse.length; i += 1) {
        ratedview.push(this.courseElement(this.props.ratedCourse[i]));
      }
    }
    if (this.props.unratedCourse !== undefined) {
      for (let i = 0; i < this.props.unratedCourse.length; i += 1) {
        unratedview.push(this.courseElement(this.props.unratedCourse[i]));
      }
    }
    return (
      <div className="RecommendCourse">
        <div className="col-8 offset-2">
          <ul className="nav nav-tabs nav-justified" id="recommend-course-tab" role="tablist">
            <li className="nav-item">
              <a
                className="nav-link active w-100"
                data-toggle="tab"
                href="#rated-tab"
                role="tab"
                aria-controls="rated"
                aria-selected="true"
                onClick={() => { this.changeTab(0)}}
              >
평가
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link w-100"
                data-toggle="tab"
                href="#unrated-tab"
                role="tab"
                aria-controls="unrated"
                aria-selected="false"
                onClick={() => { this.changeTab(1)}}
              >
미평가
              </a>
            </li>
          </ul>
          <SearchBar value={this.state.searchValues} onChange={(event, type) => this.searchOnChange(event, type)} onKeyDown={() => this.enterKey()} onToggle={() => this.onSearchToggle()} togglestatus={this.state.searchdetail} onSearch={() => this.search()} searchScore />
          <div className="tab-content overflow-y-auto" id="myTabContent" style={{ height: '350px' }} onScroll={(event) => { this.scrollHandler(event.target.scrollTop); }}>
            <div className="tab-pane show active" id="rated-tab" role="tabpanel" aria-labelledby="rated-tab">
              {ratedview}
            </div>
            <div className="tab-pane" id="unrated-tab" role="tabpanel" aria-labelledby="unrated-tab">
              {unratedview}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RecommendCourse.propTypes = {
  handleValid: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  ratedCourse: state.user.rated_course,
  unratedCourse: state.user.unrated_course,
  changedCourses: state.user.changed_courses,
});

const mapDispatchToProps = (dispatch) => ({
  getRatedCourse: (start, end, searchValues) => dispatch(actionCreators.getRatedCourse(start, end, searchValues)),
  getUnratedCourse: (start, end, searchValues) => dispatch(actionCreators.getUnratedCourse(start, end, searchValues)),
  setRatedCourse: (start, end, searchValues) => dispatch(actionCreators.setRatedCourse(start, end, searchValues)),
  setUnratedCourse: (start, end, searchValues) => dispatch(actionCreators.setUnratedCourse(start, end, searchValues)),
  onChangeslider: (id, value) => dispatch(actionCreators.putCourseprefTemp(id, value)),
  onPutCoursePref: (changedCourses) => dispatch(actionCreators.putCoursepref(changedCourses)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecommendCourse);
