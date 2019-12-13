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
      },
      ratedScrollLimit: 1500,
      unratedScrollLimit: 1500,
      ratedCourseCount: 50,
      unratedCourseCount: 50,
      tabview: 0,
      searching: false,
      commandMatch: 0,
      prv_changed: [],
    };
    this.timeToString = (time) => {
      const hour = parseInt(time / 60, 10);
      const hourString = (hour < 10 ? '0' : '') + hour;
      const minuteString = (time % 60 === 0 ? '' : '.5');
      return `${hourString}${minuteString}`;
    };
    this.is_mount = false;
    this.mouseUpListener = this.mouseUpListener.bind(this);
  }

  componentDidMount() {
    this.props.handleValid(true);
    this.props.setRatedCourse(0, 49, this.state.realValuesrated);
    this.is_mount = true;
    document.addEventListener('mouseup', this.mouseUpListener, true);
  }

  shouldComponentUpdate(nextprops) {
    if (nextprops.searchrated && this.state.tabview === 0) {
      this.resetSearch();
    }
    else if(nextprops.searchunrated && this.state.tabview === 1) {
      this.resetSearch();
    }
    return true;
  }

  componentWillUnmount() {
    this.is_mount = false;
    document.removeEventListener('mouseup', this.mouseUpListener, true);
  }

  segmentToString(weekDay, startTime) {
    const weekDayName = ['월', '화', '수', '목', '금', '토'];
    return `${weekDayName[weekDay]}${this.timeToString(startTime)}`;
  }

  resetSearch() {
    this.props.searchable();
    if (this.state.searching) this.setState({ searching: false });
  }

  mouseUpListener() {
    if (!this.is_mount) return;
    const curList = this.props.changedCourses;
    const prvList = this.state.prv_changed;
    const newList = [];
    let isSame = true;
    for (let i = 0; i < curList.length; i += 1) {
      const curId = curList[i].id;
      const curScore = curList[i].score;
      newList.push({ id: curId, score: curScore });
      if (i >= prvList.length) {
        isSame = false;
      } else {
        const prvId = prvList[i].id;
        const prvScore = prvList[i].score;
        if (curId !== prvId || curScore !== prvScore) {
          isSame = false;
        }
      }
    }
    if (!isSame) {
      this.props.onPutCoursePref(curList);
    }
    this.setState({ prv_changed: newList });
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
    this.props.onPutCoursePref(this.props.changedCourses);
    if(tab === 0){
      this.setState({
        tabview: tab,
        ratedScrollLimit: 1500,
        ratedCourseCount: 50, });
        this.props.setRatedCourse(0, 49, this.state.realValuesrated);
    }
    else if(tab === 1){
      this.setState({
        tabview: tab,
        unratedScrollLimit: 1500,
        unratedCourseCount: 50, });
        this.props.setUnratedCourse(0, 49, this.state.realValuesunrated);
    }
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
    if(this.state.tabview===0)
    {
      const newValue = this.state.searchValuesrated;
      newValue[type] = event.target.value;
      this.setState({ searchValuesrated: newValue });
    }
    else if(this.state.tabview===1)
    {
      const newValue = this.state.searchValuesunrated;
      newValue[type] = event.target.value;
      this.setState({ searchValuesunrated: newValue });
    }
  }

  search() {
    if (this.state.searching) return;
    if(this.state.tabview===0){
      this.setState({
        searching: true,
        realValuesrated: this.state.searchValuesrated,
        ratedScrollLimit: 1500,
        ratedCourseCount: 50,
      });
      this.props.setRatedCourse(0, 49, this.state.searchValuesrated);
    }
    else if(this.state.tabview===1){
      this.setState({
        searching: true,
        realValuesunrated: this.state.searchValuesunrated,
        unratedScrollLimit: 1500,
        unratedCourseCount: 50,
      });
      this.props.setUnratedCourse(0, 49, this.state.searchValuesunrated);
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
          realValuesrated: newValue,
          realValuesunrated: newValue,
          ratedScrollLimit: 1500,
          unratedScrollLimit: 1500,
          ratedCourseCount: 50,
          unratedCourseCount: 50,
          commandMatch: 0,
        });
        if(this.state.tabview === 0)this.props.setRatedCourse(0, 49, newValue);
        else if(this.state.tabview === 1)this.props.setUnratedCourse(0, 49, newValue);
      } else {
        this.setState((prevState) => ({ commandMatch: prevState.commandMatch + 1 }));
      }
    } else {
      this.setState({ commandMatch: 0 });
    }
    if (window.event.keyCode === 13) {
      this.search();
    }
  }

  render() {
    console.log(this.state.searching)
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
          value={this.state.tabview===0?this.state.searchValuesrated:this.state.searchValuesunrated}
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
  getRatedCourse: PropTypes.func.isRequired,
  getUnratedCourse: PropTypes.func.isRequired,
  onChangeslider: PropTypes.func.isRequired,
  ratedCourse: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    professor: PropTypes.string.isRequired,
    credit: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    time: PropTypes.arrayOf({
      week_day: PropTypes.number.isRequired,
      start_time: PropTypes.number.isRequired,
      end_time: PropTypes.number.isRequired,
    }),
  })).isRequired,
  unratedCourse: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    professor: PropTypes.string.isRequired,
    credit: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    time: PropTypes.arrayOf({
      week_day: PropTypes.number.isRequired,
      start_time: PropTypes.number.isRequired,
      end_time: PropTypes.number.isRequired,
    }),
  })).isRequired,
  changedCourses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
  })).isRequired,
  searchable: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  ratedCourse: state.user.rated_course,
  unratedCourse: state.user.unrated_course,
  searchrated: state.user.ratedSearched,
  searchunrated: state.user.unratedSearched,
  changedCourses: state.user.changed_courses,
});

const mapDispatchToProps = (dispatch) => ({
  getRatedCourse: (start, end, searchValues) => dispatch(actionCreators.getRatedCourse(start, end, searchValues)),
  getUnratedCourse: (start, end, searchValues) => dispatch(actionCreators.getUnratedCourse(start, end, searchValues)),
  setRatedCourse: (start, end, searchValues) => dispatch(actionCreators.setRatedCourse(start, end, searchValues)),
  setUnratedCourse: (start, end, searchValues) => dispatch(actionCreators.setUnratedCourse(start, end, searchValues)),
  onChangeslider: (id, value) => dispatch(actionCreators.putCourseprefTemp(id, value)),
  searchable: () => { dispatch(actionCreators.setRatedSearchable()); dispatch(actionCreators.setUnratedSearchable()); },
  onPutCoursePref: (changedCourses) => dispatch(actionCreators.putCoursepref(changedCourses)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecommendCourse);
