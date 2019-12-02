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
      input: '',
    };
  }

  componentDidMount() {
    this.props.handleValid(true);
    this.props.getCourseScore();
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
    return (
      <div key={course.id}>
        <div className="row">
          <div className="col-6">
            <div className="text-left">
              {course.title}
            </div>
            <div className="text-black-50 text-left small" id="recommend-course-abstract">
              {`${course.professor} | ${course.credit}학점 | ${course.time} | ${course.location}`}
            </div>
          </div>
          <div className="col-5 d-flex align-items-center">
            <div
              className="m-2 font-weight-bold text-center"
              id={`slider-value-${course.id}`}
              style={{ color: colorGradient[course.score], width: '30px' }}
            >
              {course.score}
            </div>
            <form className="flex-grow-1">
              <div className="form-group m-2">
                <input
                  type="range"
                  className="form-control-range"
                  min="0"
                  max="10"
                  id={`course-score-form-${course.id}`}
                  value={course.score}
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

  render() {
    var ratedview=[];
    var unratedview=[];
    var exceptview=[];
    if(this.props.courselist!==undefined){
      for(let i=0;i<this.props.courselist.length;i=i+1){
        if(this.props.courselist[i].except&&exceptview.length<50)exceptview.push(this.courseElement(this.props.courselist[i]));
        else if(this.props.courselist[i].rated&&ratedview.length<50)ratedview.push(this.courseElement(this.props.courselist[i]));
        else if(!(this.props.courselist[i].rated)&&unratedview.length<50) unratedview.push(this.courseElement(this.props.courselist[i]));
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
              >
예외
              </a>
            </li>
          </ul>
          <SearchBar value={this.state.input} onChange={(event) => this.setState({ input: event.target.value })} />
          <div className="tab-content overflow-y-auto" id="myTabContent" style={{ height: '350px' }}>
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
  courselist: state.user.course_score,
});

const mapDispatchToProps = (dispatch) => ({
  getCourseScore: () => dispatch(actionCreators.getCourseScore()),
  onChangeslider: (id,value) => dispatch(actionCreators.putCoursepref(id,value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecommendCourse);
