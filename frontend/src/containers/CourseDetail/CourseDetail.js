import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TwitterPicker } from 'react-color';
import * as actionCreators from '../../store/actions/index';
import Datetime from './Datetime/Datetime';
import CourseMap from './CourseMap/CourseMap';
import './CourseDetail.css';

class CourseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: -1,
      title: '',
      time: [{
        building: '',
        detail: '',
      },
      ],
      tempBuilding:{},
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

  setPosition(index) {
    this.setState({ index });
    this.setState({ tempBuilding: this.state.time[index].building})
  }


  setToProps(props) {
    const times = props.course.time.map((time) => ({
      week_day: time.week_day,
      start_time: this.timeString(time.start_time),
      end_time: this.timeString(time.end_time),
      building: time.building,
    }));
    this.setState({
      index: -1, title: props.course.title, color: props.course.color, time: times,
    });
  }

  handlePosition(building, index) {
    if (index === -1) return;
    this.setState((prevState) => {
      const { time } = prevState;
      time[index].building = building;
      return { time };
    });
  }

  appendTime() {
    this.setState((prevState) => {
      const { time } = prevState;
      time.push({
        week_day: 0,
        start_time: '12:00',
        end_time: '13:00',
        building: {
          lat: 0,
          lng: 0,
          name: '',
          detail: '',
        },
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
    this.setState({ index: -1 });
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

  validcheck(){
    if(this.props.courses===undefined||this.props.course===undefined)return false;
    for(let i=0;i<this.state.time.length;i++){
      let time=this.state.time[i];
      let st=time.start_time;
      let et=time.end_time;
      if(st===undefined||et===undefined)return false;
      if(st.length==4)st='0'+st;
      if(et.length==4)et='0'+et;
      if(st>et)return false;
      for(let j=0;j<this.props.courses.length;j++){
        if(this.props.course.id===this.props.courses[j].id)continue;
        for(let k=0;k<this.props.courses[j].time.length;k++){
          let innerTime=this.props.courses[j].time[k];
          let innerst=this.timeString(innerTime.start_time);
          let inneret=this.timeString(innerTime.end_time);
          if(innerst.length==4)innerst='0'+innerst;
          if(inneret.length==4)inneret='0'+inneret;
          if(time.week_day!=innerTime.week_day||st>=inneret||et<=innerst)continue;
          return false;
        }
      }
      for(let j=0;j<i;j++){
        let innerTime=this.state.time[j];
        let innerst=innerTime.start_time;
        let inneret=innerTime.end_time;
        if(innerst.length==4)innerst='0'+innerst;
        if(inneret.length==4)inneret='0'+inneret;
        if(time.week_day!=innerTime.week_day||st>=inneret||et<=innerst)continue;
        return false;
      }
    }
    return true;
  }

  render() {
    const { course } = this.props;
    const isCustom = course.is_custom;
    const weekDay = ['월', '화', '수', '목', '금', '토', '일'];
    const href = 'http://sugang.snu.ac.kr/sugang/cc/cc101.action?'
      + 'openSchyy=2019&openShtmFg=U000200002&openDetaShtmFg='
      + `U000300001&sbjtCd=${course.course_number}`
      + `&ltNo=${course.lecture_number}&sugangFlag=P`;

    let timeDiv;
    if (this.props.editable) {
      timeDiv = this.state.time.map((segment, index) => (
        <div className="d-flex flex-row mb-2" key={index}>
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
            onClick={() => this.setPosition(index, segment.building)}
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
    } else {
      timeDiv = this.state.time.map((segment, index) => (
        <div className="d-flex flex-row align-items-center my-0" key={index}>
          <div>{`${weekDay[segment.week_day]} ${segment.start_time} - ${segment.end_time}`}</div>
          <button
            className="px-1 btn btn-simple btn-sm"
            type="button"
            id="show-position-button"
            onClick={() => this.setPosition(index, segment.building)}
          >
            <div className="oi oi-map-marker small px-2" />
          </button>
        </div>
      ));
    }
    const lat = this.state.index !== -1 ? parseFloat(this.state.time[this.state.index].building.lat) : 0;
    const lng = this.state.index !== -1 ? parseFloat(this.state.time[this.state.index].building.lng) : 0;
    const center = { lat, lng };
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
                      {this.props.editable
                        ? (
                          <input
                            className="title form-control form-control-sm"
                            value={this.state.title}
                            onChange={(event) => { this.setState({ title: event.target.value }); }}
                          />
                        )
                        : course.title}
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
                  {!isCustom
                    ? (
                      <tr>
                        <td>링크</td>
                        <td><a href={href} rel="noopener noreferrer" target="_blank">세부 정보</a></td>
                      </tr>
                    )
                    : null}
                  <tr>
                    <td>시간</td>
                    <td>
                      {timeDiv}
                      { this.props.editable
                      && (
                      <button
                        className="w-100 btn btn-simple btn-sm my-1"
                        id="append-time-button"
                        type="button"
                        onClick={() => this.appendTime()}
                      >
                        <div className="oi oi-plus small px-2" />
                      추가
                      </button>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>색상</td>
                    <td>
                      <div className="dropdown">
                        <button
                          type="button"
                          id="dropdown-color"
                          data-toggle="dropdown"
                          aria-labelledby="Dropdown Color"
                          disabled={!this.props.editable}
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
                        center={center}
                        building={this.state.index !== -1 ? this.state.time[this.state.index].building : { name: '', detail: '' }}
                        origin={this.state.index !== -1 ? this.state.tempBuilding : { name: '', detail: '' }}
                        set={(building) => { this.handlePosition(building, this.state.index); }}
                        editable={this.props.editable}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {
              this.props.editable
                ? (
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
                    this.validcheck()?
                    (<button
                      type="button"
                      className="btn btn-dark"
                      data-dismiss="modal"
                      onClick={() => {this.updateCourse(); setTimeout(() => this.setToProps(this.props), 500)}}
                    >
                      수정
                    </button>)
                    :
                    (<button
                      type="button"
                      className="btn btn-dark"
                      data-dismiss="modal"
                      onClick={() => {this.updateCourse(); setTimeout(() => this.setToProps(this.props), 500)}}
                      title={"1. 시간이 겹치지 않는지 확인하세요.\n2. 시작 시간이 끝나는 시간보다 뒤인지 확인하세요."}
                      disabled
                    >
                      수정
                    </button>)
                  )
                }
                  </div>
                )
                : (
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      onClick={() => setTimeout(() => this.setToProps(this.props), 500)}
                      data-dismiss="modal"
                    >
                닫기
                    </button>
                  </div>
                )
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  courses: state.user.timetable.course,
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
  editable: false,
};

CourseDetail.propTypes = {
  id: PropTypes.string.isRequired,
  timetableId: PropTypes.number,
  editable: PropTypes.bool,
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
