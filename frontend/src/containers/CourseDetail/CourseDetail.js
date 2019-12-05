import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';
import { TwitterPicker } from 'react-color';
import * as actionCreators from '../../store/actions/index';
import './CourseDetail.css';

class CourseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modify:false,
      time:[]
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.course.color !== this.props.course.color) {
      this.setState({
        color: nextProps.course.color,
      });
    }
  }

  timeString(time) {
    const hour = Math.floor(time / 60);
    const minute = time - hour * 60;
    const hourString = `${hour}`;
    const minuteString = minute < 10 ? `0${minute}` : `${minute}`;
    return `${hourString}:${minuteString}`;
  };

  toggleModify() {
    this.setState({ title: this.props.course.title})
    this.setState({ modify: !this.state.modify})
    let times = this.props.course.time.map((time) => {
      return {
        week_day:time.week_day,
        start_time:this.timeString(time.start_time),
        end_time:this.timeString(time.end_time)
      }
    })
    this.setState({time:times})
    if (this.state.modify) {
      this.props.onEditCourse(this.props.course.id, { color : this.state.color, title : this.state.title, times : this.state.time });
    }
    
  }

  deleteTime(index) {
    this.setState((prevState) => {
      const { time } = prevState;
      time.splice(index, 1);
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
  modifyColor(color) {
    this.setState({ color});
  }

  render() {
    const { course } = this.props;
    
    const isCustom = course.is_custom;
    const href = 'http://sugang.snu.ac.kr/sugang/cc/cc101.action?'
      + 'openSchyy=2019&openShtmFg=U000200002&openDetaShtmFg='
      + `U000300001&sbjtCd=${course.course_number}`
      + `&ltNo=${course.lecture_number}&sugangFlag=P`;

    const weekDayName = ['월', '화', '수', '목', '금', '토', '일'];
    const timeString = (time) => {
      const hour = Math.floor(time / 60);
      const minute = time - hour * 60;
      const hourString = `${hour}`;
      const minuteString = minute < 10 ? `0${minute}` : `${minute}`;
      return `${hourString}:${minuteString}`;
    };
    const modifyTime = this.state.time.map((segment, index) => (
      <div key={index}>
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
      </div>
    ));
    const timeDiv = course.time.map((segment, index) => (
      <div key={index}>
        {`${weekDayName[segment.week_day]} (${timeString(segment.start_time)} ~ ${timeString(segment.end_time)})`}
      </div>
    ));

    return (
      <div className="CourseDetail modal fade" id={this.props.id} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              {this.state.modify?
                  <input
                    className="title form-control"
                    value={this.state.title}
                    onChange={(event) => { this.setState({ title: event.target.value }); }}
                  />:
                  <h5 className="modal-title">
                    {course.title}
                  </h5>
              }
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
                      {this.state.modify ? 
                        modifyTime : timeDiv}
                      {this.state.modify ?
                      <button
                      className="w-100 btn btn-simple my-2"
                      id="append-time-button"
                      type="button"
                      onClick={() => this.appendTime()}
                    >
                      <div className="oi oi-plus small px-2" />
                    추가
                    </button> : null}
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
                          disabled={!this.props.editable}
                        />
                        <div className="dropdown-menu">
                          <TwitterPicker
                            color={course.color}
                            onChangeComplete={(color) => this.modifyColor(color.hex)}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-dark" onClick={() => this.toggleModify()}>{this.state.modify?"완료":"수정"}</button>
              <button type="button" className="btn btn-dark" onClick={() => this.setState({modify:false})}data-dismiss="modal">닫기</button>
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
