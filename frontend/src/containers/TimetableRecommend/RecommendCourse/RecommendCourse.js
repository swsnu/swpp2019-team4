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
      },
      ratedScrollLimit:2000,
      unratedScrollLimit:2000,
      exceptScrollLimit:2000,
      ratedCourseCount:50,
      unratedCourseCount:50,
      exceptCourseCount:50,
      tabview:0,
      searchdetail:false,
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
    this.props.resetCourseScore();
    this.props.getRatedCourse(0,49,this.state.realValues);
    this.props.getUnratedCourse(0,49,this.state.realValues);
    this.props.getExceptCourse(0,49,this.state.realValues);
  }

  segmentToString(weekDay, startTime) {
    const weekDayName = ['월', '화', '수', '목', '금', '토'];
    return `${weekDayName[weekDay]}${this.timeToString(startTime)}`;
  }

  scrollHandler(scrollTop){
    const pageSize=50;
    const scrollSize=pageSize*60;
    if(this.state.tabview===0&&this.state.ratedScrollLimit<scrollTop){
      this.setState({ratedScrollLimit:this.state.ratedScrollLimit+scrollSize});
      this.props.getRatedCourse(this.state.ratedCourseCount,this.state.ratedCourseCount+pageSize-1,this.state.realValues);
      this.setState({ratedCourseCount:this.state.ratedCourseCount+pageSize});
    }
    else if(this.state.tabview==1&&this.state.unratedScrollLimit<scrollTop){
      this.setState({unratedScrollLimit:this.state.unratedScrollLimit+scrollSize});
      this.props.getUnratedCourse(this.state.unratedCourseCount,this.state.unratedCourseCount+pageSize-1,this.state.realValues);
      this.setState({unratedCourseCount:this.state.unratedCourseCount+pageSize});
    }
    else if(this.state.tabview==2&&this.state.exceptScrollLimit<scrollTop){
      this.setState({exceptScrollLimit:this.state.exceptScrollLimit+scrollSize});
      this.props.getExceptCourse(this.state.exceptCourseCount,this.state.exceptCourseCount+pageSize-1,this.state.realValues);
      this.setState({exceptCourseCount:this.state.exceptCourseCount+pageSize});
    }
  }

  onSearchToggle(){
    this.setState({searchdetail:!this.state.searchdetail});
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
    let score = course.score;
    let timeString = '';
    for (let i = 0; i < course.time.length; i += 1) {
      timeString += this.segmentToString(course.time[i].week_day, course.time[i].start_time, course.time[i].end_time);
      if (i !== course.time.length - 1) {
        timeString += ' ';
      }
    }
    return (
      <div key={course.id}>
        <div className="row">
          <div className="col-6">
            <div className="text-left">
              {course.title}
            </div>
            <div className="text-black-50 text-left small" id="recommend-course-abstract">
              {`${course.professor} | ${course.credit}학점 | ${timeString} | ${course.location}`}
            </div>
          </div>
          <div className="col-5 d-flex align-items-center">
            <div
              className="m-2 font-weight-bold text-center"
              id={`slider-value-${course.id}`}
              style={{ color: colorGradient[course.score], width: '30px' }}
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
                  onChange={(event)=>this.props.onChangeslider(course.id,event.target.value)}
                />
              </div>
            </form>
            <form>
              <div className="custom-control custom-switch">
                <input type="checkbox" className="custom-control-input" id={`course-toggle-form-${course.id}`} />
                <label
                  className="custom-control-label"
                  htmlFor={`course-toggle-form-${course.id}`}
                  aria-label="custom-control-input"
                />
              </div>
            </form>
          </div>
        </div>
        <hr className="my-2" />
      </div>
    );
  }

  searchOnChange(event,type) {
    var newValue=this.state.searchValues
    if(type==='title'){
      newValue.title=event.target.value;
    }
    else if(type=='classification'){
      newValue.classification=event.target.value;
    }
    else if(type=='department'){
      newValue.department=event.target.value;
    }
    else if(type=='degree_program'){
      newValue.degree_program=event.target.value;
    }
    else if(type=='academic_year'){
      newValue.academic_year=event.target.value;
    }
    else if(type=='course_number'){
      newValue.course_number=event.target.value;
    }
    else if(type=='lecture_number'){
      newValue.lecture_number=event.target.value;
    }
    else if(type=='professor'){
      newValue.professor=event.target.value;
    }
    else if(type=='language'){
      newValue.language=event.target.value;
    }
    else if(type=='min_credit'){
      newValue.min_credit=event.target.value;
    }
    else if(type=='max_credit'){
      newValue.max_credit=event.target.value;
    }
    this.setState({searchValues:newValue});
  }

  search(){
    this.setState({realValues:this.state.searchValues,
                   ratedScrollLimit:2000,
                   unratedScrollLimit:2000,
                   exceptScrollLimit:2000,
                   ratedCourseCount:50,
                   unratedCourseCount:50,
                   exceptCourseCount:50,});
    this.props.resetCourseScore();
    this.props.getRatedCourse(0,49,this.state.searchValues);
    this.props.getUnratedCourse(0,49,this.state.searchValues);
    this.props.getExceptCourse(0,49,this.state.searchValues);
  }

  enterKey() {
    if (window.event.keyCode === 13) {
      this.search();
    }
  }

  render() {
    var ratedview=[];
    var unratedview=[];
    var exceptview=[];
    if(this.props.ratedCourse!==undefined){
      for(let i=0;i<this.props.ratedCourse.length;i=i+1){
        ratedview.push(this.courseElement(this.props.ratedCourse[i]));
      }
    }
    if(this.props.unratedCourse!==undefined){
      for(let i=0;i<this.props.unratedCourse.length;i=i+1){
        unratedview.push(this.courseElement(this.props.unratedCourse[i]));
      }
    }
    if(this.props.exceptCourse!==undefined){
      for(let i=0;i<this.props.exceptCourse.length;i=i+1){
        exceptview.push(this.courseElement(this.props.exceptCourse[i]));
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
                onClick={()=>{this.setState({tabview:0})}}
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
                onClick={()=>{this.setState({tabview:1})}}
              >
미평가
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link w-100"
                data-toggle="tab"
                href="#exception-tab"
                role="tab"
                aria-controls="exception"
                aria-selected="false"
                onClick={()=>{this.setState({tabview:2})}}
              >
예외
              </a>
            </li>
          </ul>
          <SearchBar value={this.state.searchValues} onChange={(event,type) => this.searchOnChange(event,type)} onKeyDown={() => this.enterKey()} onToggle={()=>this.onSearchToggle()} togglestatus={this.state.searchdetail} onSearch={() => this.search()}/>
          <div className="tab-content overflow-y-auto" id="myTabContent" style={{ height: '350px' }} onScroll={(event)=>{this.scrollHandler(event.target.scrollTop)}}>
            <div className="tab-pane show active" id="rated-tab" role="tabpanel" aria-labelledby="rated-tab">
              {ratedview}
            </div>
            <div className="tab-pane" id="unrated-tab" role="tabpanel" aria-labelledby="unrated-tab">
              {unratedview}
            </div>
            <div className="tab-pane" id="exception-tab" role="tabpanel" aria-labelledby="exception-tab">
              {exceptview}
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
  exceptCourse: state.user.except_course,
});

const mapDispatchToProps = (dispatch) => ({
  resetCourseScore: () => dispatch(actionCreators.resetCourseScore()),
  getRatedCourse: (start,end) => dispatch(actionCreators.getRatedCourse(start,end)),
  getUnratedCourse: (start,end) => dispatch(actionCreators.getUnratedCourse(start,end)),
  getExceptCourse: (start,end) => dispatch(actionCreators.getExceptCourse(start,end)),
  onChangeslider: (id,value) => dispatch(actionCreators.putCourseprefTemp(id,value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecommendCourse);
