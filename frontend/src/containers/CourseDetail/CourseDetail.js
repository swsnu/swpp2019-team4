import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TwitterPicker } from 'react-color';
import {
  withScriptjs, withGoogleMap, GoogleMap, Marker,
} from 'react-google-maps';
import * as actionCreators from '../../store/actions/index';
import Datetime from './Datetime/Datetime';
import './CourseDetail.css';

class CourseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      time: [],
      color: '',
    };
    this.timeString = (time) => {
      const hour = Math.floor(time / 60);
      const minute = time - hour * 60;
      const hourString = `${hour}`;
      const minuteString = minute < 10 ? `0${minute}` : `${minute}`;
      return `${hourString}:${minuteString}`;
    };
  }

  componentDidMount() {
    this.setToProps(this.props);
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.course.id !== nextProps.course.id) {
      this.setToProps(nextProps);
    }
    return true;
  }

  setPosition(building) {
    this.setState({ center: { lat: parseFloat(building.lat), lng: parseFloat(building.lng) } });
  }

  setToProps(props) {
    const times = props.course.time.map((time) => ({
      week_day: time.week_day,
      start_time: this.timeString(time.start_time),
      end_time: this.timeString(time.end_time),
      building: time.building,
    }));
    this.setState({ title: props.course.title, color: props.course.color, time: times });
  }

  appendTime() {
    this.setState((prevState) => {
      const { time } = prevState;
      time.push({
        week_day: 0,
        start_time: '12:00',
        end_time: '13:00',
      });
      return { time };
    });
  }

  deleteTime(index) {
    this.setState((prevState) => {
      const { time } = prevState;
      time.splice(index, 1);
      return { time };
    });
  }

  handleWeekday(index, value) {
    this.setState((prevState) => {
      const { time } = prevState;
      time[index].week_day = value;
      return { time };
    });
  }

  handleTime(index, key, value) {
    this.setState((prevState) => {
      const { time } = prevState;
      time[index][key] = value;
      return { time };
    });
  }

  handleColor(color) {
    this.setState({ color });
    this.props.onEditCourse(this.props.course.id, { color });
  }

  updateCourse() {
    this.props.onEditCourse(this.props.course.id,
      { color: this.state.color, time: this.state.time, title: this.state.title });
  }

  postCustom() {
    const course = { title: this.state.title, color: this.state.color, time: this.state.time };
    this.props.onPostCustomCourse(this.props.timetableId, course);
    setTimeout(() => this.setToProps(this.props), 500);
  }

  render() {
    const CourseMap = withScriptjs(withGoogleMap((props) => (
      <GoogleMap
        defaultZoom={17}
        defaultCenter={props.center}
      >
        <Marker
          position={props.center}
        />
      </GoogleMap>
    )));

    const { course } = this.props;
    const isCustom = course.is_custom;
    const href = 'http://sugang.snu.ac.kr/sugang/cc/cc101.action?'
      + 'openSchyy=2019&openShtmFg=U000200002&openDetaShtmFg='
      + `U000300001&sbjtCd=${course.course_number}`
      + `&ltNo=${course.lecture_number}&sugangFlag=P`;

    const timeDiv = this.state.time.map((segment, index) => (
      <div className="d-flex flex-row mb-0 mb-2" key={index}>
        <select
          className="form-control form-control-sm col-3"
          id="weekday-control"
          value={segment.week_day}
          onChange={(event) => this.handleWeekday(index, event.target.value)}
        >
          <option value={0}>월</option>
          <option value={1}>화</option>
          <option value={2}>수</option>
          <option value={3}>목</option>
          <option value={4}>금</option>
          <option value={5}>토</option>
        </select>
        <Datetime
          className="mx-2"
          value={segment.start_time}
          onChange={(value) => this.handleTime(index, 'start_time', value)}
        />
        <div>
          <div className="w-100 text-center small text-black-50 pt-2"><b>-</b></div>
        </div>
        <Datetime
          className="mx-2"
          value={segment.end_time}
          onChange={(value) => this.handleTime(index, 'end_time', value)}
        />
        <button
          className="px-1 btn btn-simple btn-sm"
          type="button"
          id="show-position-button"
          onClick={() => this.setPosition(segment.building)}
        >
          <div className="oi oi-map-marker small px-2" />
        </button>
        <button
          className="px-1 btn btn-simple btn-sm"
          type="button"
          id="delete-time-button"
          onClick={() => this.deleteTime(index)}
        >
          <div className="oi oi-minus small px-2" />
        </button>
      </div>
    ));

    return (
      <div className="CourseDetail modal fade" id={this.props.id} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <table className="table">
                <colgroup>
                  <col span="1" style={{ width: '6rem' }} />
                </colgroup>
                <tbody>
                  <tr>
                    <td>제목</td>
                    <td>
                      <input
                        className="title form-control form-control-sm"
                        value={this.state.title}
                        onChange={(event) => { this.setState({ title: event.target.value }); }}
                      />
                    </td>
                  </tr>
                  {!isCustom
                    ? (
                      <tr>
                        <td>강좌번호</td>
                        <td>{course.course_number}</td>
                      </tr>
                    )
                    : null}
                  {!isCustom
                    ? (
                      <tr>
                        <td>분반번호</td>
                        <td>{course.lecture_number}</td>
                      </tr>
                    )
                    : null}
                  {!isCustom
                    ? (
                      <tr>
                        <td>학점</td>
                        <td>{course.credit}</td>
                      </tr>
                    )
                    : null}
                  {!isCustom
                    ? (
                      <tr>
                        <td>교수</td>
                        <td>{course.professor}</td>
                      </tr>
                    )
                    : null}
                  {!isCustom
                    ? (
                      <tr>
                        <td>장소</td>
                        <td>{course.location}</td>
                      </tr>
                    )
                    : null}

                  <tr>
                    <td>시간</td>
                    <td>
                      {timeDiv}
                      <button
                        className="w-100 btn btn-simple btn-sm my-1"
                        id="append-time-button"
                        type="button"
                        onClick={() => this.appendTime()}
                      >
                        <div className="oi oi-plus small px-2" />
                      추가
                      </button>
                    </td>
                  </tr>
                  {!isCustom
                    ? (
                      <tr>
                        <td>링크</td>
                        <td><a href={href} rel="noopener noreferrer" target="_blank">세부 정보</a></td>
                      </tr>
                    )
                    : null}
                  <tr>
                    <td>색상</td>
                    <td>
                      <div className="dropdown">
                        <button
                          type="button"
                          id="dropdown-color"
                          data-toggle="dropdown"
                          aria-labelledby="Dropdown Color"
                          style={{ backgroundColor: this.state.color }}
                        />
                        <div className="dropdown-menu">
                          <TwitterPicker
                            color={course.color}
                            onChangeComplete={(color) => this.handleColor(color.hex)}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>지도</td>
                    <td>
                      <CourseMap
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=
                          AIzaSyC2MiVSeJrRHzbm68f6ST_u37KTNFPH1JU&libraries=places"
                        loadingElement={<div style={{ height: '20rem' }} />}
                        containerElement={<div style={{ height: '20rem' }} />}
                        mapElement={<div style={{ height: '20rem' }} />}
                        center={this.state.center}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={() => setTimeout(() => this.setToProps(this.props), 500)}
                data-dismiss="modal"
              >
                취소
              </button>
              {
                this.props.newCourse
                  ? (
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={() => this.postCustom()}
                      data-dismiss="modal"
                    >
                      생성
                    </button>
                  )
                  : (
                    <button
                      type="button"
                      className="btn btn-dark"
                      data-dismiss="modal"
                      onClick={() => this.updateCourse()}
                    >
                      수정
                    </button>
                  )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => ({
  onEditCourse: (courseId, changedValues) => dispatch(actionCreators.editCourse(courseId, changedValues)),
  onPostCustomCourse: (timetableId, course) => dispatch(
    actionCreators.postCustomCourse(timetableId, course),
  ),
});

CourseDetail.defaultProps = {
  timetableId: undefined,
  course: {
    id: undefined,
    title: '',
    color: '#FCB900',
    time: [],
    is_custom: true,
  },
  newCourse: false,
};

CourseDetail.propTypes = {
  id: PropTypes.string.isRequired,
  timetableId: PropTypes.number,
  newCourse: PropTypes.bool,
  course: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    color: PropTypes.string,
    lecture_number: PropTypes.string,
    course_number: PropTypes.string,
    credit: PropTypes.number,
    professor: PropTypes.string,
    location: PropTypes.string,
    time: PropTypes.arrayOf(PropTypes.shape({
      start_time: PropTypes.number,
      end_time: PropTypes.number,
      week_day: PropTypes.number,
    })).isRequired,
    is_custom: PropTypes.bool,
  }),
  onEditCourse: PropTypes.func.isRequired,
  onPostCustomCourse: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseDetail);
