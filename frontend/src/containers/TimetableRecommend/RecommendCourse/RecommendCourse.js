import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './RecommendCourse.css';

class RecommendCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',

      // temporary data
      courses: [
        {
          id: 3,
          title: '죽음의 과학적 이해',
          professor: '유성호',
          credit: 3,
          time: [
            {
              start_time: 600,
              end_time: 770,
              week_day: 3,
              position: '302-408',
            },
            {
              start_time: 630,
              end_time: 770,
              week_day: 4,
              position: '302-408',
            },
          ],
          except: false,
          rated: false,
          score: 10,
        },
        {
          id: 4,
          title: '죽음의 과학적 이해',
          professor: '유성호',
          credit: 3,
          time: [
            {
              start_time: 600,
              end_time: 770,
              week_day: 3,
              position: '302-408',
            },
          ],
          except: false,
          rated: false,
          score: 0,
        },
      ],
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
  }

  segmentToString(weekDay, startTime) {
    const weekDayName = ['월', '화', '수', '목', '금', '토'];
    return `${weekDayName[weekDay]}${this.timeToString(startTime)}`;
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
    let timeString = '';
    let courseString = '';
    for (let i = 0; i < course.time.length; i += 1) {
      timeString += this.segmentToString(course.time[i].week_day, course.time[i].start_time, course.time[i].end_time);
      courseString += course.time[i].position;
      if (i !== course.time.length - 1) {
        timeString += ' ';
        courseString += '/';
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
              {`${course.professor} | ${course.credit}학점 | ${timeString} | ${courseString}`}
            </div>
          </div>
          <div className="col-5 d-flex align-items-center">
            <div
              className="m-2 font-weight-bold text-center"
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
          <div className="input-group my-2">
            <div className="input-group-prepend">
              <button className="form-control" type="button" id="recommend-search-filter">
                <div className="oi oi-target" />
              </button>
            </div>
            <input
              type="text"
              className="form-control"
              id="recommend-search-name"
              placeholder="과목명"
              value={this.state.input}
              onChange={(event) => this.setState({ input: event.target.value })}
            />
            <div className="input-group-append">
              <button className="btn btn-dark" type="button" id="recommend-search-button">
                <div className="oi oi-magnifying-glass" />
              </button>
            </div>
          </div>

          <div className="tab-content overflow-y-auto" id="myTabContent" style={{ height: '350px' }}>
            <div className="tab-pane show active" id="rated-tab" role="tabpanel" aria-labelledby="rated-tab">
              {this.courseElement(this.state.courses[0])}
              {this.courseElement(this.state.courses[1])}
            </div>
            <div className="tab-pane" id="unrated-tab" role="tabpanel" aria-labelledby="unrated-tab">
              평가되지 않은 과목
            </div>
            <div className="tab-pane" id="exception-tab" role="tabpanel" aria-labelledby="exception-tab">
              이미 수강한 과목
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

export default connect(null, null)(RecommendCourse);
