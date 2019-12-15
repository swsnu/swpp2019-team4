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
      searchValuesrated: {
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
        sort: 1,
      },
      realValuesrated: {
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
        sort: 1,
      },
      searchValuesunrated: {
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
        sort: 0,
      },
      realValuesunrated: {
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
        sort: 0,
      },
      ratedScrollLimit: 1500,
      unratedScrollLimit: 1500,
      ratedCourseCount: 50,
      unratedCourseCount: 50,
      tabview: 0,
      searching: false,
    };
    this.timeToString = (time) => {
      const hour = parseInt(time / 60, 10);
      const hourString = (hour < 10 ? '0' : '') + hour;
      const minuteString = (time % 60 === 0 ? '' : '.5');
      return `${hourString}${minuteString}`;
    };
    this.is_mount = false;
  }

  componentDidMount() {
    this.props.handleValid(true);
    this.props.setRatedCourse(0, 49, this.state.realValuesrated);
    this.is_mount = true;
  }

  shouldComponentUpdate(nextprops) {
    if (nextprops.searchrated && this.state.tabview === 0) {
      this.resetSearch();
    } else if (nextprops.searchunrated && this.state.tabview === 1) {
      this.resetSearch();
    }
    return true;
  }

  componentWillUnmount() {
    this.is_mount = false;
  }

  segmentToString(weekDay, startTime) {
    const weekDayName = ['월', '화', '수', '목', '금', '토'];
    return `${weekDayName[weekDay]}${this.timeToString(startTime)}`;
  }

  resetSearch() {
    this.props.searchable();
    if (this.state.searching) this.setState({ searching: false });
  }

  handleDelete(id) {
    this.props.onDeleteCoursePref(id);
    this.props.onChangeDelete(id);
  }

  scrollHandler(scrollTop) {
    const pageSize = 50;
    const scrollSize = pageSize * 60;
    if (this.state.tabview === 0 && this.state.ratedScrollLimit < scrollTop) {
      this.setState((prevState) => ({ ratedScrollLimit: prevState.ratedScrollLimit + scrollSize }));
      this.props.getRatedCourse(this.state.ratedCourseCount,
        this.state.ratedCourseCount + pageSize - 1,
        this.state.realValuesrated);
      this.setState((prevState) => ({ ratedCourseCount: prevState.ratedCourseCount + pageSize }));
    } else if (this.state.tabview === 1 && this.state.unratedScrollLimit < scrollTop) {
      this.setState((prevState) => ({ unratedScrollLimit: prevState.unratedScrollLimit + scrollSize }));
      this.props.getUnratedCourse(this.state.unratedCourseCount,
        this.state.unratedCourseCount + pageSize - 1,
        this.state.realValuesunrated);
      this.setState((prevState) => ({ unratedCourseCount: prevState.unratedCourseCount + pageSize }));
    }
  }

  changeTab(tab) {
    if (tab === 0) {
      this.setState({
        tabview: tab,
        ratedScrollLimit: 1500,
        ratedCourseCount: 50,
      });
      this.props.setRatedCourse(0, 49, this.state.realValuesrated);
    } else if (tab === 1) {
      this.setState({
        tabview: tab,
        unratedScrollLimit: 1500,
        unratedCourseCount: 50,
      });
      this.props.setUnratedCourse(0, 49, this.state.realValuesunrated);
    }
  }

  courseElement(course) {
    const colorGradient = [
      '#FF0037',
      '#EB1637',
      '#D72C37',
      '#C34237',
      '#AF5837',
      '#9B6E37',
      '#878437',
      '#739A37',
      '#5FB037',
      '#4BC637',
      '#37DC37',
    ];
    const { score } = course;
    let timeString = '';
    for (let i = 0; i < course.time.length; i += 1) {
      timeString += this.segmentToString(course.time[i].week_day, course.time[i].start_time, course.time[i].end_time);
      if (i !== course.time.length - 1) {
        timeString += ' ';
      }
    }
    return (
      <div key={course.id}>
        <div
          className="expected_color"
          style={{
            backgroundColor: colorGradient[Math.round(course.expected)], height: '40px', width: '3px', float: 'left',
          }}
        />
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
                  onMouseUp={(event) => this.props.onPutCoursePref(course.id, event.target.value)}
                />
              </div>
            </form>
          </div>
          {score !== '-'
            && (
            <button type="button" className="col-1 btn btn-simple btn-sm" onClick={() => this.handleDelete(course.id)}>
              <div className="oi oi-delete" />
            </button>
            )}
        </div>
        <hr className="my-2" />
      </div>
    );
  }

  searchOnChange(value, type) {
    if (this.state.tabview === 0) {
      this.setState((prevState) => {
        const newValue = prevState.searchValuesrated;
        newValue[type] = value;
        return { searchValuesrated: prevState.searchValuesrated };
      });
    } else if (this.state.tabview === 1) {
      this.setState((prevState) => {
        const newValue = prevState.searchValuesunrated;
        newValue[type] = value;
        return { searchValuesunrated: prevState.searchValuesunrated };
      });
    }
    if (type === 'sort') {
      this.search();
    }
  }

  search() {
    if (this.state.searching) return;
    if (this.state.tabview === 0) {
      this.setState((prevState) => {
        this.props.setRatedCourse(0, 49, prevState.searchValuesrated);
        return {
          searching: true,
          realValuesrated: prevState.searchValuesrated,
          ratedScrollLimit: 1500,
          ratedCourseCount: 50,
        };
      });
    } else if (this.state.tabview === 1) {
      this.setState((prevState) => {
        this.props.setUnratedCourse(0, 49, prevState.searchValuesunrated);
        return {
          searching: true,
          realValuesunrated: prevState.searchValuesunrated,
          unratedScrollLimit: 1500,
          unratedCourseCount: 50,
        };
      });
    }
  }

  enterKey() {
    if (window.event.keyCode === 13) {
      this.search();
    }
  }

  render() {
    const ratedSortTitle = ['평점 오름차순', '평점 내림차순', '가나다순'];
    const unratedSortTitle = ['추천 순', '가나다순'];
    const ratedSortArray = ratedSortTitle.map((title, index) => ({
      title,
      value: this.state.searchValuesrated.sort === index,
    }));
    const unratedSortArray = unratedSortTitle.map((title, index) => ({
      title,
      value: this.state.searchValuesunrated.sort === index,
    }));

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
      <div className="RecommendCourse h-100">
        <ul className="nav nav-tabs nav-justified" id="recommend-course-tab" role="tablist">
          <li className="nav-item">
            <a
              className="nav-link active w-100"
              id="rated-tab-clicker"
              data-toggle="tab"
              href="#rated-tab"
              role="tab"
              aria-controls="rated"
              aria-selected="true"
              onClick={() => { this.changeTab(0); }}
            >
평가
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link w-100"
              id="unrated-tab-clicker"
              data-toggle="tab"
              href="#unrated-tab"
              role="tab"
              aria-controls="unrated"
              aria-selected="false"
              onClick={() => { this.changeTab(1); }}
            >
미평가
            </a>
          </li>
        </ul>
        <SearchBar
          value={this.state.tabview === 0 ? this.state.searchValuesrated : this.state.searchValuesunrated}
          sortValue={this.state.tabview === 0 ? ratedSortArray : unratedSortArray}
          onChange={(event, type) => this.searchOnChange(event, type)}
          onKeyDown={() => this.enterKey()}
          onSearch={() => this.search()}
          searchScore
          searching={this.state.searching}
        />
        <div
          className="tab-content overflow-y-auto"
          id="myTabContent"
          style={{ height: 'calc(100% - 8rem)' }}
          onScroll={(event) => { this.scrollHandler(event.target.scrollTop); }}
        >
          <div className="tab-pane show active" id="rated-tab" role="tabpanel" aria-labelledby="rated-tab">
            {ratedview}
          </div>
          <div className="tab-pane" id="unrated-tab" role="tabpanel" aria-labelledby="unrated-tab">
            {unratedview}
          </div>
        </div>
      </div>
    );
  }
}

RecommendCourse.propTypes = {
  handleValid: PropTypes.func.isRequired,
  setRatedCourse: PropTypes.func.isRequired,
  setUnratedCourse: PropTypes.func.isRequired,
  onPutCoursePref: PropTypes.func.isRequired,
  onDeleteCoursePref: PropTypes.func.isRequired,
  getRatedCourse: PropTypes.func.isRequired,
  getUnratedCourse: PropTypes.func.isRequired,
  onChangeslider: PropTypes.func.isRequired,
  onChangeDelete: PropTypes.func.isRequired,
  ratedCourse: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    professor: PropTypes.string.isRequired,
    credit: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    time: PropTypes.arrayOf(PropTypes.shape({
      week_day: PropTypes.number.isRequired,
      start_time: PropTypes.number.isRequired,
      end_time: PropTypes.number.isRequired,
    })),
  })).isRequired,
  unratedCourse: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    professor: PropTypes.string.isRequired,
    credit: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    time: PropTypes.arrayOf(PropTypes.shape({
      week_day: PropTypes.number.isRequired,
      start_time: PropTypes.number.isRequired,
      end_time: PropTypes.number.isRequired,
    })),
  })).isRequired,
  searchable: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  ratedCourse: state.user.rated_course,
  unratedCourse: state.user.unrated_course,
  searchrated: state.user.ratedSearched,
  searchunrated: state.user.unratedSearched,
});

const mapDispatchToProps = (dispatch) => ({
  getRatedCourse: (start, end, searchValues) => dispatch(actionCreators.getRatedCourse(start, end, searchValues)),
  getUnratedCourse: (start, end, searchValues) => dispatch(actionCreators.getUnratedCourse(start, end, searchValues)),
  setRatedCourse: (start, end, searchValues) => dispatch(actionCreators.setRatedCourse(start, end, searchValues)),
  setUnratedCourse: (start, end, searchValues) => dispatch(actionCreators.setUnratedCourse(start, end, searchValues)),
  onChangeslider: (id, value) => dispatch(actionCreators.putCourseprefTemp(id, value)),
  onChangeDelete: (id, value) => dispatch(actionCreators.deleteCourseprefTemp(id, value)),
  searchable: () => { dispatch(actionCreators.setRatedSearchable()); dispatch(actionCreators.setUnratedSearchable()); },
  onPutCoursePref: (id, value) => dispatch(actionCreators.putCoursepref(id, value)),
  onDeleteCoursePref: (id) => dispatch(actionCreators.deleteCoursepref(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecommendCourse);
