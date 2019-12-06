import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TwitterPicker } from 'react-color';
import * as actionCreators from '../../store/actions/index';
import Datetime from 'react-datetime';
import './CourseDetail.css';

class CourseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modify:false,
      title: '',
      time: [],
      color: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.course.color !== this.props.course.color) {
      this.setState({
        color: nextProps.course.color,
      });
    }
    let times = nextProps.course.time.map((time) => {
      return {
        week_day:time.week_day,
        start_time:this.timeString(time.start_time),
        end_time:this.timeString(time.end_time)
      }
    })
    this.setState({ title : nextProps.course.title, color : nextProps.course.color, time : times})
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

  handleTime(index, key, moment) {
    if (typeof moment === 'string') return;
    const value = moment.format('H:mm');
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

  timeString(time){
    const hour = Math.floor(time / 60);
    const minute = time - hour * 60;
    const hourString = `${hour}`;
    const minuteString = minute < 10 ? `0${minute}` : `${minute}`;
    return `${hourString}:${minuteString}`;
  };

  toggleModify() {
    this.setState({ modify : !this.state.modify})
    if (this.state.modify) {
      this.props.onEditCourse(this.props.course.id, { color:this.state.color, time:this.state.time, title:this.state.title })
    }
  }

  reset() {
    this.setState({ modify : false })
    let times = this.props.course.time.map((time) => {
      return {
        week_day:time.week_day,
        start_time:this.timeString(time.start_time),
        end_time:this.timeString(time.end_time)
      }
    })
    this.setState({ title : this.props.course.title, color : this.props.course.color, time : times})
  }
  render() {
    const { course } = this.props;
    const isCustom = course.is_custom;
    const href = 'http://sugang.snu.ac.kr/sugang/cc/cc101.action?'
      + 'openSchyy=2019&openShtmFg=U000200002&openDetaShtmFg='
      + `U000300001&sbjtCd=${course.course_number}`
      + `&ltNo=${course.lecture_number}&sugangFlag=P`;

    const weekDayName = ['월', '화', '수', '목', '금', '토', '일'];
    const timeDiv = this.state.time.map((segment, index) => (
      this.state.modify?
      <div className="form-group row px-3 mb-0 mb-2" key={index}>
        <select
          className="form-control col-3"
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
          className="col pr-0"
          dateFormat={false}
          timeFormat="H:mm"
          value={segment.start_time}
          onChange={(moment) => this.handleTime(index, 'start_time', moment)}
        />
        <div className="col-1 px-0">
          <div className="w-100 text-center small text-black-50 pt-2">~</div>
        </div>
        <Datetime
          className="col px-0"
          dateFormat={false}
          timeFormat="H:mm"
          value={segment.end_time}
          onChange={(moment) => this.handleTime(index, 'end_time', moment)}
        />
        <button
          className="col-1 px-1 btn btn-simple"
          type="button"
          id="delete-time-button"
          onClick={() => this.deleteTime(index)}
        >
          <div className="oi oi-minus small px-2" />
        </button>
      </div>:
      <div key={index}>
        {`${weekDayName[segment.week_day]} (${segment.start_time} ~ ${segment.end_time})`}
      </div>
    ));

    return (
      <div className="CourseDetail modal fade" id={this.props.id} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{
                this.state.modify?
                <input
                  className="title form-control"
                  value={this.state.title}
                  onChange={(event) => { this.setState({ title: event.target.value }); }}
                />:
                course.title
              }
              </h5>
            </div>
            <div className="modal-body">
              <table className="table">
                <tbody>
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
                    {this.state.modify ?
                    (
                      <td>
                        <div className="dropdown">
                          <button
                            type="button"
                            id="dropdown-color"
                            data-toggle="dropdown"
                            aria-labelledby="Dropdown Color"
                            style={{ backgroundColor: this.state.color }}
                            disabled={!this.props.editable}
                          />
                          <div className="dropdown-menu">
                            <TwitterPicker
                              color={course.color}
                              onChangeComplete={(color) => this.handleColor(color.hex)}
                            />
                          </div>
                        </div>
                      </td>) : 
                          <div
                            id="dropdown-color"
                            data-toggle="dropdown"
                            aria-labelledby="Dropdown Color"
                            style={{ backgroundColor: this.state.color }}
                            disabled={!this.props.editable}
                          />}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-dark" onClick={() => this.toggleModify()}>{this.state.modify?'완료':'수정'}</button>
              <button type="button" className="btn btn-dark" onClick={() => this.reset()}data-dismiss="modal">닫기</button>
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
});

CourseDetail.defaultProps = {
  editable: false,
};

CourseDetail.propTypes = {
  id: PropTypes.string.isRequired,
  course: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    color: PropTypes.string,
    lecture_number: PropTypes.string,
    course_number: PropTypes.string,
    time: PropTypes.arrayOf(PropTypes.shape({
      start_time: PropTypes.number,
      end_time: PropTypes.number,
      week_day: PropTypes.number,
    })).isRequired,
  }).isRequired,
  editable: PropTypes.bool,
  onEditCourse: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseDetail);
